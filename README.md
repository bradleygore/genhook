[![Build Status][travis-image]][travis-url]  [![Coverage Status](https://coveralls.io/repos/github/bradleygore/genhook/badge.svg?branch=master)](https://coveralls.io/github/bradleygore/genhook?branch=master)

# genhook
Git Hook Generator - easily incorporate [git hooks](http://githooks.com/) into your, and your team's, front end workflow!

##Installation##

```bash
> npm install -g genhook
```

##Usage##

* Navigate to the root of any git repo

```bash
> genhook (<git-hook>|installer) [flags]
```

##Git Hooks##
Genhook focuses on client hooks - i.e. those that would run on the developer's box as opposed to a server.
Generating a hook is simple - just call genhook with the name of the git hook you want generated, and provide a few options!

####Valid Hooks####

* *pre-commit* - runs at the beginning of a commit, even before a message is added
* *prepare-commit-msg* - runs before the message editor is fired up, but after default message created
* *commit-msg* - runs after message is populated and saved to temp file
* *post-commit* - runs at the end of a commit after it has finished

####Git Hook Flags####

| Flag | Short Flag | Description | Required |
|------|------------|-------------|----------|
| dest | -d | Relative destination path for the generated hooks to be put into if saving to your repository for team use | N |
| taskRunnerRoot | -r | Relative Path to your task runner sourcefile - i.e. path to gulpfile.js - defaults to CWD from where genhook command is ran. | If gulpfile isn't at repository root, provide relative path to it here |
| tasks | -t | What task(s) to call from the git hook - i.e. `-t lint checkstyle test` | Y |
| windows | -w | Include bash script to support using windows | N - defaults to false |

If you use the `-d` flag to save the generated hooks to your codebase, then an install script can be generated to allow others on the team to easily utilize the same hooks!

####Git Hook Example####

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

##Installer##

If you created hooks and saved them to your repository, then Genhook can create a handy installer script that anyone on your team can use to install the hooks in their environments.

```bash
> genhook installer [flags]
```

####Installer Flags####

| Flag | Short Flag | Description | Required |
|------|------------|-------------|----------|
| dest | -d | Relative destination path for the generated installer script | Y - i.e. gulp-tasks/ |
| hooks | -h | Relative path to directory holding Genhook-generated hook scripts | Y - i.e. git-hooks/ |
| name | -n | What to name the generated file - i.e. install-git-hooks.js | N - defaults to installGitHooks.js |
| taskName | -t | What to name the gulp task that will perform the hooks install | N - defaults to install-git-hooks |

####Installer Examples####
```bash
> cd path/to/repo/root

> genhook installer -d gulp-tasks/ -h git-hooks/ -n installHooks.js -t install-hooks
# File created: ./gulp-tasks/installHooks.js
# Gulp task to do the install will be named install-hooks 
# When that gulp task is ran, it will install all hooks from ./git-hooks/ into ./.git/hooks and automatically handle windows vs *nix
```

-----------------------------------------------------

##WIP##
* Finish testing on Windows environment (development done in linux)
* Unit Tests
* Support for more task-runners than just gulp - would like to support grunt also





[travis-url]: https://travis-ci.org/bradleygore/genhook
[travis-image]: http://img.shields.io/travis/bradleygore/genhook.svg