#! /usr/bin/env node
/* eslint-disable no-undef */

const path = require("path");
const cli = require("commander");
const {
    spawnCommand,
    clearCommandLine,
    execCommand,
    logger,
    isPortInUse,
    killPort,
    branchParent,
    branchName,
    // customUrl
} = require("../utils");
const prompts = require("prompts");
const ora = require("ora");
const ip = require("ip");
const fs = require("fs");

const {
    DEFAULT_PORT,
    M_PORT,
    D_PORT,
    calculateStartScript,
} = require("../consts");
const { adbReverse } = require("../adb-reverse");

const PROD_URL = "";
const DEMO_URL = "";

const CURR_DIR = process.cwd();
const PACKAGE_PATH = path.join(CURR_DIR, "package.json");

const getBaseApi = async () => {
    let isPausedAutoSelect = false;
    let isStoppedPromiseMessageWithTimer = false;
    const messageAutoSelect =
        "    The [First choice] will be auto-selected in ${count} second(s)";

    const choices = [
        { title: "Production", description: PROD_URL, value: PROD_URL },
        { title: "Demo", description: DEMO_URL, value: DEMO_URL },
        { title: "Custom", value: "custom" },
    ];

    const firstChoice = choices[0];

    async function messageWithTimer(count) {
        const stream = process.stderr;
        if (!stream.isTTY) {
            console.log(messageAutoSelect.replace("${count}", count));
            await new Promise((resolve) => setTimeout(resolve, count * 1000));
            return;
        }

        for (let localCount = count; localCount > 0; localCount -= 1) {
            if (isStoppedPromiseMessageWithTimer) {
                return;
            }
            if (isPausedAutoSelect) {
                isPausedAutoSelect = false;
                localCount = count;
                stream.cursorTo(0);
                stream.clearLine(1);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (localCount <= 10) {
                stream.cursorTo(0);
                stream.write(messageAutoSelect.replace("${count}", localCount));
                stream.clearLine(1);
            }
        }
        console.log("");
    }

    const responseFromUser = prompts(
        {
            type: "select",
            name: "value",
            message: `Which base Api url do you want to use?`,
            choices,
            initial: 0,
            onState() {
                isPausedAutoSelect = true;
            },
        },
        {
            onSubmit() {
                isStoppedPromiseMessageWithTimer = true;
            },
            onCancel() {
                isStoppedPromiseMessageWithTimer = true;
            },
        }
    );

    const responseFromTimeout = firstChoice
        ? messageWithTimer(12).then(() => firstChoice)
        : new Promise(() => {});

    const { value } = await Promise.race([
        responseFromUser,
        responseFromTimeout,
    ]);

    let baseApi = value;

    if (value === "custom") {
        const { customEndpoint } = await prompts({
            type: "text",
            name: "customEndpoint",
            message: "What is your custom base Api url?",
        });

        baseApi = customEndpoint;
    }

    return baseApi;
};

const printPackagerInfo = (proj, spinner) => {
    return setTimeout(() => {
        const ipAddress = ip.address();
        const ipAndPort = `${ipAddress}:${DEFAULT_PORT}`;

        clearCommandLine();
        console.error(
            `%c SUPER APP TEMPLATE`,
            `font-family: monospace`
        );
        logger.line();
        spinner.succeed(
            `Welcome to SuperApp packager, ${proj} server started at`
        );
        logger.notice(`http://localhost:${DEFAULT_PORT}`, 1);
        logger.notice(`http://${ipAndPort}`, 1);
        logger.line();
    }, 5000);
};

const startReactNativeServer = async (options) => {
    const { baseUrl } = options;

    const package = JSON.parse(
        (await fs.promises.readFile(PACKAGE_PATH)).toString()
    );

    [DEFAULT_PORT, M_PORT, D_PORT].forEach(async (port) => {
        const pid = await isPortInUse(port);

        if (pid) {
            await killPort(port);
        }
    });

    let baseApi = "" //baseUrl || (await getBaseApi());

    logger.line();
    logger.success(`You will use ${baseApi} as base Api url`, 1);
    logger.line();

    const spinner = ora("Starting server").start();

    const timeoutId = printPackagerInfo(package.name, spinner);

    try {
        await adbReverse();
        const script = await calculateStartScript(package.name, baseApi);
        await spawnCommand(script, [], {
            cwd: process.cwd(),
            env: process.env,
            stdio: [process.stdin, process.stdout, process.stderr],
            encoding: "utf-8",
            shell: true,
        });
    } catch (error) {
        clearTimeout(timeoutId);
        logger.line();
        logger.error(error);
        spinner.fail("Starting server failed");
    }

    return;
};

cli.command("start")
    .option(
        "-b, --base-url <string>",
        "The domain name or IP address of the API server"
    )
    .description("Start react native server.")
    .action(startReactNativeServer);

module.exports = {
    startReactNativeServer,
};
