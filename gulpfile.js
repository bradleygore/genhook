const gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint({
            extends: 'eslint:recommended',
            env: {
                node: true
            },
            ecmaFeatures: {
                arrowFunctions: true,
                blockBindings: true,
                modules: true,
                templateStrings: true
            },
            rules: {
                'no-console': 0
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);
