'use strict';

const fs = require('fs');
const placeholders = require('../genhook/util/placeholders');
const hydrateTemplate = require('../genhook/util/hydrateTemplates');
const lab = exports.lab = require('lab').script();
const code = require('code');
const expected = fs.readFileSync(`${__dirname}/expected/hydratedTemplate.txt`, 'utf8')
    .replace(/(\r\n|\n|\r)\s?/gm,'\n');
let template = fs.readFileSync(`${__dirname}/fixtures/unhydratedTemplate.txt`, 'utf8')
    .replace(/(\r\n|\n|\r)\s?/gm,'\n');
let templateVars = {};

lab.experiment('Template Hydration', () => {
    templateVars[placeholders.taskName] = 'HOOK';
    templateVars[placeholders.hookName] = 'JACK';
    templateVars[placeholders.hooksPath] = 'PIRATE BAY';
    templateVars[placeholders.taskRunnerArgs] = JSON.stringify(['DASHING', 'ADVENTUROUS']);
    templateVars['unsupportedPlaceholder'] = 'PICKLES';

    template = hydrateTemplate(template, templateVars).replace(/(\r\n|\n|\r)\s?/gm,'\n');

    lab.test('hydrates template with values populated in the provided templateVars ' +
        'where there is a match with placeholders', done => {

        code.expect(expected).to.equals(template);
        code.expect(template).not.to.include('PICLES');
        done();
    });
});