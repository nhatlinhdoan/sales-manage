var gulp = require('gulp');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('js', function(){
  browserify('./client/javascripts/src/app.jsx')
    .transform(reactify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('client/javascripts/build/'));
});

gulp.task('watch', function() {
    gulp.watch("client/javascripts/src/**/*.jsx", ["js"])
});

gulp.task('default', ['js', 'watch']);