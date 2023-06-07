#! /usr/bin/env node
const cli = require("commander");

cli.description("SuperApp CLI");
cli.name("superApp");
cli.usage("<command>");
cli.addHelpCommand(true);
cli.helpOption(true);

require("./start");
require("./adb-reverse");

// eslint-disable-next-line no-undef
cli.parse(process.argv);
