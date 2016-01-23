'use strict';

//Heavily borrowed from https://github.com/gulpjs/gulp-cli/ unit tests setup

var lab = exports.lab = require('lab').script();
var code = require('code');
var fs = require('fs-extra');
var child = require('child_process');
var path = require('path');

var installerOutFile = path.resolve(`${__dirname}/output/installer-relativePaths.out`);
var installerOutput = fs.readFileSync(`${__dirname}/expected/installer-relativePaths.txt`, 'utf8')
    .replace(/(\r\n|\n|\r)\s?/gm,'\n');

var hookOutFile = path.resolve(`${__dirname}/output/hooks-relativePaths.out`);
var hookOutput = fs.readFileSync(`${__dirname}/expected/hooks-relativePaths.txt`, 'utf8')
    .replace(/(\r\n|\n|\r)\s?/gm,'\n');

lab.experiment('installer|hooks: flags: Paths should be relative', () => {

    lab.before((done) => {
        fs.mkdirpSync(path.resolve(__dirname, 'output'));
        done();
    });

    lab.after((done) => {
        fs.removeSync(path.resolve(__dirname, 'output'));
        done();
    });

    lab.test('installer outputs error if any paths are passed in as absolute instead of relative', done => {
        child.exec('node ' + __dirname + '/../bin/genHook.js installer -d /absolute/path -h /absolute/path > ' + installerOutFile, err => {
            var stdout = fs.readFileSync(installerOutFile, { encoding: 'utf8' });
            code.expect(stdout.replace(/(\r\n|\n|\r)\s?/gm,'\n')).to.equals(installerOutput);
            done(err);
        });
    });

    lab.test('hooks outputs error if any paths are passed in as absolute instead of relative', (done) => {
        child.exec(`node ${__dirname}/../bin/genHook.js pre-commit -d /absolute/path -r /absolute/path -t pc-lint > ${hookOutFile}`, err => {
            var stdout = fs.readFileSync(hookOutFile, {encoding: 'utf8'});
            code.expect(stdout.replace(/(\r\n|\n|\r)\s?/gm,'\n')).to.equals(hookOutput);
            done(err);
        });
    });
});


