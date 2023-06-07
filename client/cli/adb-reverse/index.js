#! /usr/bin/env node
/* eslint-disable no-undef */

const cli = require("commander");
const { spawnCommand } = require("../utils");
const {
    DEFAULT_PORT,
    M_PORT,
    D_PORT,
    HOST_PORT,
    PRODUCT_PORT,
} = require("../consts");

const adbReverse = async () => {
    try {
        const adbReverse = `
        adb reverse tcp:${DEFAULT_PORT} tcp:${DEFAULT_PORT} 
        adb reverse tcp:${HOST_PORT} tcp:${HOST_PORT} 
        adb reverse tcp:${D_PORT} tcp:${D_PORT} 
        adb reverse tcp:${M_PORT} tcp:${M_PORT} 
        adb reverse tcp:${PRODUCT_PORT} tcp:${PRODUCT_PORT}
        `;

        await spawnCommand(adbReverse, [], {
            cwd: process.cwd(),
            env: process.env,
            stdio: [process.stdin, process.stdout, process.stderr],
            encoding: "utf-8",
            shell: true,
        });
    } catch (error) {
        console.error(error);
    }

    return;
};

cli.command("adb-reverse").description("adb reverse").action(adbReverse);

module.exports = {
    adbReverse,
};
