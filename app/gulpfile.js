var shell = require( 'shelljs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
// var to5ify = require('6to5ify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var argv = require('yargs').argv;
var plumber = require('gulp-plumber');

var less = require('gulp-less');
var jade = require('gulp-jade');

var doneInit = false;
var outputDir = 'builds/';

var port = argv.p || '9999';

// automatically set livereload port for additional instance
var livereload_port = (port !== '9999') ? (+port + 40000) + '' : '35729';


gulp.task('initialize', function(cb) {
    var err; // no error.
    console.log('doneInit', doneInit );
    if (!doneInit) {
        console.log('initializing ...');

        // do stuff here
        shell.cp('-Rf', './statics/*', './builds');
        console.log('copying statics folder ...');

        doneInit = true;
        console.log('done initialize');
        err = null; // no error.
        // if err is not null and not undefined, the orchestration will stop
        // call cb to signal task initialize is done
        cb(err);
    } else {
        err = null; // no error
        cb(err);
    }
});



gulp.task('before', ['initialize'], function(cb) {
    // do stuff here

    console.log('done task before');
    var err = null; // no error
    // if err is not null and not undefined, the orchestration will stop
    // call cb to signal task initialize is done
    cb(err);
});



gulp.task('js', function() {
  browserify('./src/js/index.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
});




gulp.task('onStaticsFolderChange', function() {
    shell.cp('-Rf', './statics/*', './builds');
    console.log('copying statics folder .....');
    // gulp.src('./src/statics/*.html').pipe(connect.reload());
    connect.reload();
});



gulp.task('watch', ['before'], function(){
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('statics/**/*', ['onStaticsFolderChange']);
});



gulp.task('less', ['before'],  function(){
    var config = {};
    config.writeSrcMap = true;
    return gulp.src('src/less/main.less')
        .pipe(plumber())
        .pipe(less())
        .on('error', function(err){
            //see //https://github.com/gulpjs/gulp/issues/259
            console.log(err);
            // this.emit('end');
        })
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});



gulp.task('connect', ['before'], function(){
    connect.server({
        root: outputDir,
        // open: { browser: 'Google Chrome'} // Option open does not work in gulp-connect v 2.*. Please read "readme" https://github.com/AveVlad/gulp-connect}
        port: port,
        livereload: {port : livereload_port}
    });
});

gulp.task('default', ['js', 'less', 'watch', 'connect']);

