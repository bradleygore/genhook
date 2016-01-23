#!/usr/bin/env node

'use strict';
const argsUtil = require('./util/defineArgs');
const chalk = require('chalk');
const argv = argsUtil.yargs.argv;
const validHooks = argsUtil.supportedHooks;
const genhook = require('./genhook');
const command = argv._[0];

if (command === 'installer') {
    genhook.install(argv);
} else if (validHooks.indexOf(command.toLowerCase()) > -1) {
    genhook.generateHook(argv);
} else {
    console.log(chalk.red(`\nThe supplied command '${command}' is not valid.\n`));
}
