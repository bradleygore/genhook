'use strict';

//Heavily borrowed from https://github.com/gulpjs/gulp-cli/ unit tests setup

var lab = exports.lab = require('lab').script();
var code = require('code');
var fs = require('fs-extra');
var child = require('child_process');
var path = require('path');
var outfile = path.resolve(__dirname, 'output/flags-help.out');

var output = fs.readFileSync(__dirname + '/expected/help.txt', 'utf8').replace(/(\r\n|\n|\r)\s?/gm,'\n');

lab.experiment('flag: help', () => {

    lab.before((done) => {
        fs.mkdirpSync(path.resolve(__dirname, 'output'));
        done();
    });

    lab.after((done) => {
        fs.removeSync(path.resolve(__dirname, 'output'));
        done();
    });

    lab.test('shows help using --help', (done) => {
        child.exec('node ' + __dirname + '/../bin/genHook.js --help > ' + outfile, (err) => {
            var stdout = fs.readFileSync(outfile, { encoding: 'utf8' });
            code.expect(stdout.replace(/(\r\n|\n|\r)\s?/gm,'\n')).to.equals(output);
            done(err);
        });
    });
});
