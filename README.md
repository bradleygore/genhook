[![NPM version][npm-image]][npm-url]  [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-img]][coveralls-url]

#genhook
Git Hook Generator - easily incorporate [git hooks](http://githooks.com/) into your, and your team's, front end workflow!

##Installation

```bash
> npm install -g genhook-cli
```

##Usage

* Navigate to the root of any git repo

```bash
> genhook (<git-hook>|installer) [flags]
```

##Git Hooks
Genhook focuses on client hooks (i.e. those that would run on the developer's box as opposed to a server).
Genhook's approach to git hooks is to simply tie them right into the task-runner that already knows how to lint files, etc... Simply using the hook to execute one/more task for your runner to execute!
*Currently, gulp is the only supported task runner.*

Generating a hook is simple - just call genhook with the name of the git hook you want generated, and provide a few options!

####Valid Hooks

* *pre-commit* - runs at the beginning of a commit, even before a message is added
* *prepare-commit-msg* - runs before the message editor is fired up, but after default message created
* *commit-msg* - runs after message is populated and saved to temp file
* *post-commit* - runs at the end of a commit after it has finished

####Git Hook Flags

| Flag | Short Flag | Description | Required |
|------|------------|-------------|----------|
| dest | -d | Relative destination path for the generated hooks to be put into if saving to your repository for team use | N |
| taskRunnerRoot | -r | Relative Path to your task runner sourcefile - i.e. path to gulpfile.js - defaults to CWD from where genhook command is ran. | If gulpfile isn't at repository root, provide relative path to it here |
| tasks | -t | What task(s) to call from the git hook - i.e. `-t lint checkstyle test` | Y |
| windows | -w | Include bash script to support using windows | N - defaults to false |

If you use the `-d` flag to save the generated hooks to your codebase, then an install script can be generated to allow others on the team to easily utilize the same hooks!

####Git Hook Example

```bash
> cd path/to/repo/root

#generate a pre-commit hook script and save them to the codebase
> genhook pre-commit -d git-hooks/pre-commit/ -t lint checkstyle -w true
#files created:
#  ./.git/hooks/pre-commit (hook script that git will execute)
#  ./.git/hooks/pre-commit-js (only generated if you're on windows)
#  ./git-hooks/pre-commit/pre-commit-js (nodejs script)
#  ./git-hooks/pre-commit-pre-commit-win (sh script to be used when installing on windows - calls nodejs script when executed)
```
*For a more in-depth example of using git hooks + task runner to do cool stuff (such as lint only the files being committed), check out [this demo](https://github.com/bradleygore/pre-commit-demo).*


##Installer

If you created hooks and saved them to your repository, then Genhook can create a handy installer script that anyone on your team can use to install the hooks in their environments.

```bash
> genhook installer [flags]
```

####Installer Flags

| Flag | Short Flag | Description | Required |
|------|------------|-------------|----------|
| dest | -d | Relative destination path for the generated installer script | Y - i.e. gulp-tasks/ |
| hooks | -h | Relative path to directory holding Genhook-generated hook scripts | Y - i.e. git-hooks/ |
| name | -n | What to name the generated file - i.e. hookInstaller.js | N - defaults to installGitHooks.js |
| taskRunnerRoot | -r | Relative path to your task runner main file - i.e. path to gulpfile.js | N - defaults to CWD |
| taskName | -t | What to name the gulp task that will perform the hooks install | N - defaults to install-git-hooks |

####Installer Examples
```bash
> cd path/to/repo/root

> genhook installer -d gulp-tasks/ -h git-hooks/ -n installHooks.js -t install-hooks
# File created: ./gulp-tasks/installHooks.js
# Gulp task to do the install will be named install-hooks 
# When that gulp task is ran, it will install all hooks from ./git-hooks/ into ./.git/hooks and automatically handle windows vs *nix
```

##WIP
* Add in support for remaining client git hooks
* Support for more task-runners than just gulp - would like to support grunt also

##Acknowledgements

Heavily borrowed architecture and testing setup from the excellent [gulp-cli](https://github.com/gulpjs/gulp-cli)

[npm-url]: https://npmjs.org/package/genhook-cli
[npm-image]: http://img.shields.io/npm/v/genhook-cli.svg

[travis-url]: https://travis-ci.org/bradleygore/genhook
[travis-image]: http://img.shields.io/travis/bradleygore/genhook.svg

[coveralls-url]: https://coveralls.io/github/bradleygore/genhook?branch=master
[coveralls-img]: https://coveralls.io/repos/github/bradleygore/genhook/badge.svg?branch=master