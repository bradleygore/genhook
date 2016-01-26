#!/usr/bin/env node

'use strict';
const argsUtil = require('./util/defineArgs');
const chalk = require('chalk');
const argv = argsUtil.yargs.argv;
const validHooks = argsUtil.supportedHooks;
const genhook = require('./genhook');
const command = argv._[0];

if (!command) {
    console.error(chalk.red('Missing Command: '),
        `please use ${chalk.bold.cyan('genhook --help')} to see help and usage info.`);
} else if (command === 'installer') {
    genhook.install(argv);
} else if (validHooks.indexOf(command.toLowerCase()) > -1) {
    genhook.generateHook(argv);
} else {
    console.log(chalk.red(`The supplied command '${command}' is not valid.`));
}
