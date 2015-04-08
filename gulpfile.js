var gulp = require('gulp'),
    options = require('./options.json'),
    plugins = require('gulp-load-plugins')(),
    through2 = require('through2'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    stylish = require('jshint-stylish'),
    map = require('map-stream'),
    notifier = require('node-notifier');

gulp.task('js', function () {
    gulp.src('./src/js/main.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path)
                .transform(babelify.configure({
                    optional: ['es7.classProperties']
                }))
                .bundle(function (err, res) {
                    if (err) throw err;

                    file.contents = res;
                    next(err, file);
                });
        }))
        .pipe(plugins.header(options.header.join('\n') + '\n'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify({
            preserveComments: 'some'
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(map(function (file, cb) {
            if (file.jshint && file.jshint.success) {
                notifier.notify({
                    title: 'Gulp',
                    message: 'JavaScript compiled.'
                });
            } else if (file.jshint && file.jshint.results.length) {
                var result = file.jshint.results[0];
                notifier.notify({
                    title: 'JSHint Error',
                    subtitle: file.jshint.results.length > 1 ? ('and ' + (file.jshint.results.length - 1) + ' more...') : '',
                    message: result.error.reason
                });
            }
            cb(null, file);
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('css', function () {
    gulp.src('./src/css/main.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: options.browsers,
            remove: true // removes unneeded prefixes from source
        }))
        .pipe(plugins.cssmin())
        .pipe(plugins.header(options.header.join('\n') + '\n'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(map(function (file, cb) {
            notifier.notify({
                title: 'Gulp',
                message: 'SASS compiled.'
            });
            cb(null, file);
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/css/**/*.scss', ['css']);
});

gulp.task('default', ['js', 'css', 'watch']);
