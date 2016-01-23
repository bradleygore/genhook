'use strict';

//Heavily borrowed from https://github.com/gulpjs/gulp-cli/ unit tests setup

var lab = exports.lab = require('lab').script();
var code = require('code');
var child = require('child_process');

lab.experiment('hook: invalid', () => {
    lab.test('shows invalid hook error', (done) => {
        child.exec('node ' + __dirname + '/../bin/genHook.js fake-hook -t', (err, stdout) => {
            code.expect(stdout.replace(/(\r\n|\n|\r)\s?/gm,'')).to.equals(`The supplied command 'fake-hook' is not valid.`);
            done(err);
        });
    });
});

