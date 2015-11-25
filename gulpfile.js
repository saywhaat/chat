var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var mold = require('mold-source-map');
var nodemon = require('gulp-nodemon');

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('watch', function () {

    nodemon({
        script: 'server/app.js',
        watch: [
            'server/**'
        ]
    });

    var bundler = watchify(browserify('./client/app.jsx', {debug: true, paths: ["./client"]}).transform(babelify, {presets: ['react']}));

    function rebundle() {
        bundler.bundle()
        .on('error', onError)

        .pipe(mold.transform(function(src, write){
            if(src && src.sourcemap && src.sourcemap.sourcemap){
                var map = src.sourcemap.sourcemap;

                for(var i=0; i< map.sources.length; i++){
                    map.sources[i] = map.sources[i].replace(new RegExp("\\\\", "g"), "/");
                }

                var text = new Buffer(JSON.stringify(map)).toString('base64');
                write('//# sourceMappingURL=data:application/json;base64,' + text);
            }
        }))

        .pipe(exorcist('client/bundle.js.map'))
        .pipe(source('bundle.js'))

        .pipe(gulp.dest('./client'));
    }

    bundler.on('update', function() {
        console.log('-> bundling...');
        rebundle();
    });

    rebundle();
});

gulp.task('default', ['watch']);
