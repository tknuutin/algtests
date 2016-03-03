

'use strict';

var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var glob = require('glob');
var debug = require('gulp-debug');
var del = require('del');

var path = require('path');
var join = path.join;

var config = {
    sourceFolder: 'src/',
    buildFolder: 'public/',
    bundleName: 'app.js'
};

var subprojects = [
    './clonegraph', './test'
];

gulp.task('clean', function(cb) {
    del(subprojects.map(function(path) {
        return join(path, config.buildFolder);
    }), cb);
});

gulp.task('copy', function(){
    // gulp.src(join(config.baseFolder, 'assets/**/*'), { base: join(config.baseFolder, 'assets/') })
    //     .pipe(gulp.dest(join(config.buildFolder, 'assets')));
})

gulp.task('build', ['clean', 'copy'], function () {
    return subprojects.map(function(path){
        var b = browserify({
            transform: [["babelify", { presets: ["es2015"]}]],
            entries: glob.sync(join(path, config.sourceFolder, '/**/*.js')),
            // debug: true,
            paths: [config.sourceFolder]
        });

        return b.bundle()
            .pipe(source(config.bundleName))
            // .pipe(debug())
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
                // .pipe(uglify())
                .on('error', gutil.log)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(join(path, config.buildFolder)));
    });
});