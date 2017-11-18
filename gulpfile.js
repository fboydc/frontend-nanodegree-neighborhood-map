var gulp = require('gulp');
var minifyInline = require('gulp-minify-inline');
var runSequence = require('run-sequence');


gulp.task('copy-bootstrap-css', function(){
	return gulp.src('app/css/bootstrap.min.css')
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

gulp.task('minify-inline', function(){
	return gulp.src('app/**/*.html')
		.pipe(minifyInline())
		.pipe(gulp.dest('dist'));
});


gulp.task('build', function(callback){
	runSequence('copy-bootstrap-css',
				'copy-fonts',
				'copy-imgs',
				'minify-inline');
});

