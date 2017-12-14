var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create()


gulp.task('default', ['js']);

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
});

gulp.task('buildAll', function(){
    return gulp.src(['src/**/!(main)*.js', 'src/main.js'])
        .pipe(concat('all.js'))    
        .pipe(babel())
        .pipe(gulp.dest('build'));
})

gulp.task('dist', function(){
    return gulp.src(['vendor/**/*.js', 'build/all.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
      stream: true
    }))
})

//gulp.task('watch', function(){
//    runSequence('build', 'buildAll', 'dist');
//    gulp.watch('src/**/*.js', function(){
//        runSequence('build', 'buildAll', 'dist');
//    });
//})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  })
})

gulp.task('serve', function(){
    runSequence('build', 'buildAll', 'dist', 'browserSync');
    gulp.watch('src/**/*.js', function(){
        runSequence('build', 'buildAll', 'dist')
    });
    gulp.watch('index.html', browserSync.reload);
    gulp.watch('css/main.css', browserSync.reload);

})