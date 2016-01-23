const path = require('path');
const fs = require('fs');
const placeholders = require('./util/placeholders');
const hydrateTemplate = require('./util/hydrateTemplates');
const logger = require('./util/logger');

module.exports = hookProps => {
    "use strict";

    let taskRunnerArgs = hookProps.tasks,
        taskRunnerRoot = hookProps.taskRunnerRoot,
        hookName = hookProps._[0].toLowerCase(),
        isInWindows = process.platform === 'win32',
        includeWindows = isInWindows || hookProps.windows,
        saveToRepo = !!hookProps.dest,
        inRepoRoot;

    try {
        fs.statSync(path.resolve('.git'));
        inRepoRoot = true;
    } catch(e) {
        inRepoRoot = false;
    }

    if (taskRunnerRoot !== undefined) {
        taskRunnerRoot = `\'${path.relative(process.cwd(), taskRunnerRoot)}\'`;
    } else {
        taskRunnerRoot = `undefined`;
    }

    if (!(saveToRepo || inRepoRoot)) {
        logger.error(`GenHook ${hookName} command must either be ran at repository root, or with a destination to save hook scripts to.`);
        return;
    }

    if (saveToRepo) {
        try {
            fs.statSync(path.resolve(hookProps.dest));
        } catch(e) {
            fs.mkdirSync(path.resolve(hookProps.dest));
        }
    }

    fs.readFile(path.join(__dirname, '..', 'templates', 'gulp', 'hook-js'), (err, buffer) => {
        if (err) {
            logger.error(`Encountered an error reading js hook template: ${err}`);
            return;
        }

        logger.updateStatus(`Generating ${hookName} js script`);

        let template = buffer.toString(),
            templateVars = {};

        templateVars[placeholders.taskRunnerArgs] = JSON.stringify(taskRunnerArgs);
        templateVars[placeholders.taskRunnerRoot] = taskRunnerRoot;
        templateVars[placeholders.hookName] = hookName;

        template = hydrateTemplate(template, templateVars);

        if (saveToRepo) {
            let fileName = hookName + '-js';
            logger.updateStatus(`Saving ${fileName} script to repository`);
            fs.writeFile(path.resolve(hookProps.dest, fileName), template, (err) => {
                if (err) {
                    logger.error(`Error saving ${fileName}-js script to repository: ${err}`);
                } else {
                    logger.updateStatus(`Finished saving ${fileName} script to repository`);
                }
            });
        }

        if (inRepoRoot) {
            let fileName = hookName + (isInWindows ? '-js' : '');
            logger.updateStatus(`Saving ${fileName} script to /.git/hooks/ directory`);
            fs.writeFile(path.resolve('.git', 'hooks', fileName), template, (err) => {
                if (err) {
                    logger.error(`Error saving ${fileName} script to /.git/hooks/ directory: ${err}`);
                } else {
                    //make the file executable
                    fs.chmod(path.resolve('.git', 'hooks', fileName), '755', (err) => {
                        if (err) {
                            logger.error(`ERROR: Unexpected error when trying to make file executable ${err}`);
                        } else {
                            logger.updateStatus(`Finished saving ${fileName} script to /.git/hooks/ directory`);
                        }
                    });
                }
            });
        }
    });

    if (includeWindows) {
        fs.readFile(path.join(__dirname, '..', 'templates', 'gulp', 'hook-win'), (err, buffer) => {
            if (err) {
                logger.error(`Encountered an error reading windows hook template: ${err}`);
                return;
            }

            logger.updateStatus(`Generating ${hookName} windows script`);

            let template = buffer.toString(),
                templateVars = {};

            templateVars[placeholders.hookName] = hookName;

            template = hydrateTemplate(template, templateVars);

            if (saveToRepo) {
                let fileName = hookName + '-win';
                logger.updateStatus(`Saving ${fileName} script to repository`);
                fs.writeFile(path.resolve(hookProps.dest, fileName), template, (err) => {
                    if (err) {
                        logger.error(`Error saving ${fileName} script to repository: ${err}`);
                    } else {
                        logger.updateStatus(`Finished saving ${fileName} script to repository`);
                    }
                });
            }

            if (inRepoRoot && isInWindows) {
                logger.updateStatus(`Saving ${hookName} script to /.git/hooks/ directory`);
                fs.writeFile(path.resolve('.git/hooks/', hookName), template, (err) => {
                    if (err) {
                        logger.error(`Error saving ${hookName} script to /.git/hooks/ directory: ${err}`);
                    } else {
                        logger.updateStatus(`Finished saving ${hookName} script to /.git/hooks/ directory`);
                    }
                });
            }
        });
    }
};
