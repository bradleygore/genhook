const path = require('path');
const fs = require('fs-extra');
const placeholders = require('./util/placeholders');
const hydrateTemplate = require('./util/hydrateTemplates');
const logger = require('./util/logger');

module.exports = installerProps => {
    "use strict";

    let destDir = installerProps.dest,
        generatedHooksPath = installerProps.hooks,
        taskRunnerRootPath = installerProps.taskRunnerRoot,
        generatedHooksDirName = generatedHooksPath.indexOf(path.sep) > -1 ?
            generatedHooksPath.split(path.sep).reverse()[0] :
            generatedHooksPath,
        fileName = installerProps.name,
        taskName = installerProps.taskName,
        templateVars = {};

    if (path.isAbsolute(destDir) || path.isAbsolute(generatedHooksPath) || path.isAbsolute(taskRunnerRootPath)) {
        logger.error(
            'Destination, Task Runner Root, and Hooks paths should be relative to where you are calling GenHook from (the root of your repository).'
        );
        return;
    }

    fs.stat(path.resolve('.git'), (err) => {
        if (err) {
            logger.error('GenHook commands need to be ran at your git repository\'s root.');
            return;
        }

        fs.readFile(path.join(__dirname, '..', 'templates', 'gulp', 'installer'), (err, buffer) => {
            if (err) {
                logger.error(`Encountered an unexpected error reading installer template: ${err}`);
                return;
            }

            logger.updateStatus('Generating script to install git hooks to local environments.');

            let template = buffer.toString();
            templateVars[placeholders.hooksPath] = path.relative(taskRunnerRootPath, generatedHooksPath);
            templateVars[placeholders.hooksPathBase] = generatedHooksDirName;
            templateVars[placeholders.taskName] = taskName;
            templateVars[placeholders.repoTrunkPath] = path.relative(taskRunnerRootPath, '.git/hooks');

            template = hydrateTemplate(template, templateVars);

            fs.stat(path.resolve(destDir), function(err) {
                if (err) {
                    fs.mkdirsSync(path.resolve(destDir));
                }

                fs.writeFile(path.resolve(destDir, fileName), template, (err) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        logger.updateStatus('Completed generating git hook installer task script.');
                    }
                });
            });
        });
    });
};