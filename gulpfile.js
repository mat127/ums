const gulp = require('gulp');
const del = require('del');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');
const ghp = require('gulp-gh-pages');

function clean() {
 return del('build/**', {force:true});
}

function ghPages() {
  return gulp.src('build/**/*')
    .pipe(ghp());
}

function compressJs() {
  return gulp.src('src/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/'));
}

function compressCss() {
    return gulp.src('src/*.css')
        .pipe(cleanCss())
        .pipe(gulp.dest('build/'));
}

function copyHtml() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build/'));
}

function copy() {
    return gulp.src(['src/*.html','src/*.js','src/*.css'])
        .pipe(gulp.dest('build/'));
}

exports.package = gulp.parallel(compressJs,compressCss,copyHtml);
exports.copy = copy;
exports.clean = clean;
exports.clean = clean;
exports.deploy = gulp.series(clean,exports.package,ghPages);