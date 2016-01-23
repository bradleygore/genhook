const chalk = require('chalk'),
    cRed = chalk.red,
    cGreen = chalk.green,
    status = 'STATUS: ',
    error = 'ERROR: ';

exports.updateStatus = (msg) => {
    console.log(cGreen(status), msg);
};

exports.error = (msg) => {
    console.log(cRed(error), msg);
};