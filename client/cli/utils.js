const { spawn, exec } = require("child_process");
const chalk = require("chalk");
const unzipper = require("unzipper");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);
const execPromise = util.promisify(exec);

const logger = {
    echo(message, level = 0, wrapper = null, asString = false) {
        let output;
        if (typeof message === "string") {
            const string = "  ".repeat(level) + message;
            output = wrapper ? wrapper(string) : string;
        } else {
            output = message;
        }

        if (asString) {
            return output;
        }

        console.log(output);
    },

    error(message, level = 0, asString = false) {
        return this.echo(message, level, chalk.red, asString);
    },

    success(message, level = 0, asString = false) {
        return this.echo(message, level, chalk.green, asString);
    },

    warning(message, level = 0, asString = false) {
        return this.echo(message, level, chalk.yellow, asString);
    },

    notice(message, level = 0, asString = false) {
        return this.echo(message, level, chalk.blue, asString);
    },

    info(message, level = 0, asString = false) {
        return this.echo(message, level, null, asString);
    },

    line(asString = false) {
        return this.echo("", 0, null, asString);
    },
};

const spawnCommand = (cmd, args, options, onOutput) => {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, options);

        child.stdout?.on("data", (data) => {
            onOutput && onOutput(data);
        });

        child.on("close", function (code) {
            // Should probably be 'exit', not 'close'
            // *** Process completed
            resolve(code);
        });
        child.on("error", function (err) {
            // *** Process creation failed
            reject(err);
        });
    });
};

const execCommand = (cmd, onOutput) => {
    return new Promise((res, rej) => {
        const child = exec(cmd, (err, stdout, stderr) => {
            if (err) {
                // logger.error(`error: ${err}`);
                rej(err);
                return;
            }

            res(stdout);
        });

        child.stdout.on("data", function (data) {
            onOutput && onOutput(data);
        });
    });
};

function clearCommandLine() {
    // eslint-disable-next-line no-undef
    process.stdout.write("\033c");
}

async function isPortInUse(port) {
    let pid;

    try {
        pid = await execCommand(`lsof -ti:${port}`);
    } catch (error) {}

    return pid;
}

async function killPort(port) {
    try {
        await execCommand(`kill -9 $(lsof -ti:${port})`);
    } catch (error) {}
}
async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function downloadFile(url, outputPath, onProgress) {
    const { data, headers } = await axios.get(url, {
        responseType: "stream",
    });

    const totalLength = headers["content-length"];
    let downloaded = 0;

    data.on("data", (chunk) => {
        downloaded += chunk.length;

        let percentCompleted = Math.ceil((downloaded / totalLength) * 100);

        onProgress(percentCompleted);
    });

    await pipeline(data, fs.createWriteStream(outputPath));
}

async function installAppOnAndroid(deviceId, apkPath) {
    try {
        await execCommand(`adb -s ${deviceId} install ${apkPath}`);
    } catch (error) {
        console.error("errrrrr", error);
    }
}

async function runAppOnAndroid(deviceId, launcherActivity, args = "") {
    try {
        let pars = "";
        if (args) {
            pars = `--es `;
            for (const key in args) {
                pars += `${key} ${args[key]} `;
            }
        }
        await execCommand(
            `adb -s ${deviceId} shell am start -n ${launcherActivity} ${pars}`
        );
    } catch (error) {
        console.error("error", error);
    }
}
async function launchAndroidEmulator(deviceId) {
    try {
        await execCommand(
            `~/Library/Android/sdk/emulator/emulator -avd ${deviceId} > /dev/null 2>&1 &`
        );
        await wait(5000);
        let activeEmulators = (await getAndroidActiveDevices()).filter(
            (x) => x.type === "Emulator"
        );
        if (activeEmulators.length > 0) return activeEmulators[0];

        await wait(5000);
        activeEmulators = (await getAndroidActiveDevices()).filter(
            (x) => x.type === "Emulator"
        );
        if (activeEmulators.length > 0) return activeEmulators[0];
    } catch (error) {
        console.error(error);
    }
}
async function getAndroidActiveDevices() {
    try {
        let devices = [];
        await execCommand(`adb devices -l`, (d) => {
            devices = d
                .replace("List of devices attached", "")
                .split(/\r?\n/)
                .filter(Boolean)
                .map((x) => {
                    let a = x.split(/(\s+)/);
                    const model =
                        a.filter((x) => x.startsWith("device:")).length > 0
                            ? a
                                  .find((c) => c.startsWith("device:"))
                                  ?.replace("device:", "") || "Emulator"
                            : a
                                  .find((c) => c.startsWith("model:"))
                                  ?.replace("model:", "") || "Emulator";

                    if (Array.isArray(a)) {
                        a = a[0];
                    }

                    return {
                        id: a,
                        type: x.startsWith("emulator")
                            ? "Emulator"
                            : "Real Device",
                        model,
                    };
                });
        });

        for (const device of devices) {
            await execCommand(
                `adb -s ${device.id} shell getprop ro.build.version.sdk`,
                (d) => {
                    device.osVersion = d.replace("\n", "");
                }
            );
        }

        devices.sort((a, b) => (a.type > b.type ? -1 : 1));

        return devices;
    } catch (error) {
        console.error(error);
    }
}
async function getAndroidRealDevices() {
    try {
        let devices = await getAndroidActiveDevices();
        devices = devices.map((x) => x.type === "Real Device");
        return devices;
    } catch (error) {
        console.error(error);
    }
}
async function getAndroidEmulators() {
    let data = "";
    try {
        await execCommand(
            "~/Library/Android/sdk/emulator/emulator -list-avds",
            (em) => {
                data = em;
            }
        );
    } catch (error) {
        console.error(error);
    }

    let devices = data
        .split(/\r?\n/)
        .filter(Boolean)
        .map((x) => {
            let a = x.split(/_/);
            const osVersion = a[a.length - 1];
            const model = x
                .replace(/_/g, " ")
                .replace("API", "")
                .replace(osVersion, "")
                .trimEnd();

            return { id: x, model, osVersion, type: "Emulator" };
        });

    return devices;
}
async function getIosRealDevices() {
    try {
        let data = "";
        await spawnCommand("npx", ["ios-deploy", "-c"], {}, (d) => {
            data += d.toString();
        });

        const devices = data
            .split(/\r?\n/)
            .filter((x) => x.startsWith("[....] Found "))
            .filter(Boolean)
            .map((x) => {
                const arr = x
                    .split(/[()]+/)
                    .filter(function (e) {
                        return e.trimStart().trimEnd();
                    })
                    .filter(Boolean);

                const id = arr[0].replace("[....] Found ", "").trimEnd();
                const info = arr[1].split(", ");
                const name = info[1];
                const osVersion = info[4];

                return {
                    name,
                    osVersion,
                    id,
                    state: "Booted",
                    isAvailable: true,
                    type: "Real Device",
                };
            });

        return devices;
    } catch (error) {
        console.error(error);
    }
}
async function getIosSimulators() {
    let data = "";
    try {
        await execCommand(`xcrun simctl list devices --json`, (d) => {
            data += d.toString();
        });
    } catch (error) {
        console.error(error);
    }

    const devices = [];
    const devs = JSON.parse(data).devices;

    for (const key in devs) {
        if (key.includes("iOS")) {
            const a = key.split(".");
            const osVersion = a[a.length - 1]
                .replace("iOS-", "")
                .replace("-", ".");
            devs[key].forEach((element) => {
                devices.push({
                    osVersion,
                    id: element.udid,
                    state: element.state,
                    isAvailable: element.isAvailable,
                    name: element.name,
                    type: "Simulator",
                });
            });
        }
    }

    return devices;
}
async function getIosActiveDevices() {
    try {
        let reals = await getIosRealDevices();
        let sims = (await getIosSimulators()).filter(
            (x) => x.state === "Booted"
        );
        return [...reals, ...sims];
    } catch (error) {
        console.error(error);
    }
}
async function installAppOnIOS(deviceId, appPath, isRealDevice) {
    try {
        if (isRealDevice) {
            console.log("isRealDevice", appPath);
            await spawnCommand("npx", [
                "ios-deploy",
                "--debug",
                "--bundle",
                appPath,
            ]);
        } else {
            await execCommand(
                `xcrun simctl install ${deviceId || "booted"} ${appPath}`
            );
        }
    } catch (error) {
        // console.error("++error+++",error);
    }
}
async function runAppOnIOS(deviceId, appId) {
    try {
        await execCommand(
            `xcrun simctl launch ${deviceId || "booted"} ${appId} `
        );
    } catch (error) {
        console.error(error);
    }
}

async function launchIosSimulator(deviceId) {
    try {
        await execCommand(
            `open -a Simulator ${
                deviceId ? `--args -CurrentDeviceUDID ${deviceId}` : ""
            }`
        );
        // await wait(5000);
        await execCommand(`xcrun simctl boot ${deviceId}`);
        await wait(9000);
    } catch (error) {
        console.error(error);
    }
}

async function unzip(path, outputPath) {
    return fs
        .createReadStream(path)
        .pipe(unzipper.Extract({ path: outputPath }));
}

function branchParent(cwd) {
    const commands = [
        "git show-branch -a 2>/dev/null", //  Get git branch
        "grep '*'",
        'grep -v "$(git rev-parse --abbrev-ref HEAD)"',
        "head -n1",
        "sed 's/.*\\[\\(.*\\)\\].*/\\1/'",
        "sed 's/[\\^~].*//'",
    ];

    return execPromise(commands.join(" | "), {
        cwd: cwd || process.cwd(),
    }).then(({ stdout }) => stdout.trim());
}

function branchName(cwd) {
    return execPromise(`git branch --show-current`, {
        cwd: cwd || process.cwd(),
    }).then(({ stdout }) => stdout.trim());
}

module.exports = {
    logger,
    isPortInUse,
    killPort,
    wait,
    downloadFile,
    getIosSimulators,
    getIosRealDevices,
    getIosActiveDevices,
    getAndroidActiveDevices,
    getAndroidRealDevices,
    installAppOnAndroid,
    runAppOnAndroid,
    getAndroidEmulators,
    launchAndroidEmulator,
    installAppOnIOS,
    runAppOnIOS,
    launchIosSimulator,
    spawnCommand,
    execCommand,
    clearCommandLine,
    unzip,
    branchParent,
    branchName,
};
