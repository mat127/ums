const gulp = require('gulp');
const del = require('del');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');

const SRC_DIR = "src";
const PACKAGE_DIR = "docs";

function clean() {
 return del(PACKAGE_DIR + "/**", {force:true});
}

function compressJs() {
  return gulp.src(SRC_DIR + '/*.js')
    .pipe(terser())
    .pipe(gulp.dest(PACKAGE_DIR + '/'));
}

function compressCss() {
    return gulp.src(SRC_DIR + '/*.css')
        .pipe(cleanCss())
    .pipe(gulp.dest(PACKAGE_DIR + '/'));
}

function copyHtml() {
    return gulp.src(SRC_DIR + '/**/*.html')
    .pipe(gulp.dest(PACKAGE_DIR + '/'));
}

exports.package = gulp.parallel(compressJs,compressCss,copyHtml);
exports.clean = clean;
