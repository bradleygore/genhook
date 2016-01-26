var gulp = require('gulp'),
    path = require('path'),
    chmod = require('gulp-chmod'),
    rename = require('gulp-rename');

gulp.task('install-git-hooks', function () {

    if (/win/.test(process.platform)) {
        return gulp.src([path.join('git-utils/hooks', '**', '*-win'), path.join('git-utils/hooks', '**', '/*-js')], {base: ''})
            .pipe(rename(function fixName(path) {
                path.basename = path.basename.replace('-win', '');
            }))
            .pipe(gulp.dest('.git/hooks'));
    } else {
        return gulp.src('git-utils/hooks/**/*-js', {base: ''})
            .pipe(rename(function fixName(path) {
                path.basename = path.basename.replace('-js', '');
            }))
            //need to make them executable by all
            .pipe(chmod(755))
            .pipe(gulp.dest('.git/hooks'));
    }
});