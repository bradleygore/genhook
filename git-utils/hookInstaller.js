var gulp = require('gulp'),
    chmod = require('gulp-chmod'),
    rename = require('gulp-rename');

gulp.task('install-git-hooks', () => {
    if (/win/.test(process.platform)) {
        return gulp.src(['git-utils/hooks/**/*-win', 'git-utils/hooks/**/*-js'])
            .pipe(rename(path => {
                path.dirname = '/';
                path.basename = path.basename.replace('-win', '');
            }))
            .pipe(gulp.dest('.git/hooks'));
    } else {
        return gulp.src('git-utils/hooks/**/*-js')
            .pipe(rename(path => {
                path.dirname = '/';
                path.basename = path.basename.replace('-js', '');
            }))
            //need to make them executable by all
            .pipe(chmod(755))
            .pipe(gulp.dest('.git/hooks'));
    }
});