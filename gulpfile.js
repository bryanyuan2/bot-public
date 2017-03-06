var gulp = require('gulp'),
    connect = require('gulp-connect'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    minimist = require('minimist'),
    nodemon = require('gulp-nodemon');

var paths = {
      index: ['./server.js'],
      server: [ './routes/*.js']
    };

var knownOptions = {
      string: 'env',
      default: { env: process.env.NODE_ENV || 'production' }
    }, 
    options = minimist(process.argv.slice(2), knownOptions);

gulp.task('html', function () {
  gulp.src(paths.index)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.index, ['html']);
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': options.env }
  })
})

/* default */
gulp.task('default', ['watch', 'start']);