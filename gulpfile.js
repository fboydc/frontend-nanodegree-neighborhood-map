var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');


gulp.task('copy-css', function(){
	return gulp.src('app/css/**/*.min.css')
		.pipe(gulp.dest('dist/css/'));
});


gulp.task('copy-fonts', function(){
	return gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts/'));
});

gulp.task('copy-imgs', function(){
	return gulp.src('app/img/*')
		.pipe(gulp.dest('dist/img/'));
});

gulp.task('copy-js', function(){
	return gulp.src('app/js/**/*.min.js')
		.pipe(gulp.dest('dist/js/'));

});

gulp.task('copy-html', function(){
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));
});

gulp.task('minify-main-css', function(){
	return gulp.src('app/css/main.css')
		  .pipe(cssnano())
		  .pipe(gulp.dest('dist/css/'))
});

gulp.task('minify-main-js', function(){
	return gulp.src('app/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'));
});




gulp.task('build', function(callback){
	runSequence('copy-css',
				'copy-fonts',
				'copy-imgs',
				'copy-js',
				'copy-html',
				'minify-main-css',
				'minify-main-js'
				);
});

