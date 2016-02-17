var gulp 		= require('gulp');
var jade 		= require('gulp-jade');
var sass 		= require('gulp-sass');
var bourbon 	= require('bourbon').includePaths;
var prefix 		= require('gulp-autoprefixer');
//var rename 	= require('gulp-rename');
//var minify 	= require('gulp-cssnano');
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var cp 			= require('child_process');
var browserSync = require('browser-sync').create();
var watch		= require('gulp-watch');

var messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
* Build the Jekyll Site
**/
gulp.task('jekyll-build', function (done) {
	browserSync.notify(messages.jekyllBuild);
	var pl = process.platform === "win32" ? "jekyll.bat" : "jekyll";
	return cp.spawn(pl, ['build'], {stdio: 'inherit'})
		.on('close', done);
});

/**
* Rebuild Jekyll & do page reload
**/
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['style', 'jekyll-build'], function() {
	browserSync.init({
		server: {
			baseDir: '_site'
		},
		notify: false
	});
});

/**
* Comiled Jade files to HTML
**/
gulp.task('jade', function () {
	gulp.src('_jadefiles/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('_includes'));
});

/**
* Compiled files from _scss into both _site/css (for live injecting) & site (for future jekyll build)
**/
gulp.task('style', function () {
	gulp.src('assets/css/main.sass')
		.pipe(sass({
			includePaths: [bourbon],
			onError: browserSync.notify
		}).on('error', sass.logError))
		.pipe(prefix(['last 15 version', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		// .pipe(minify())
		// .pipe(rename({
		// 	suffix: '.min',
		// 	prefix: ''
		// }))
		.pipe(gulp.dest('_site/assets/css'))
		.pipe(gulp.dest('assets/css'))
		.pipe(browserSync.reload({stream:true}));
});

/**
* Task comiled JS files
**/
gulp.task('script', function () {
	return gulp.src([
		'_libs/modernizr/modernizr.min.js',
		'_libs/jquery/jquery-1.11.3.min.js',
		'_libs/waypoints/waypoints.min.js',
		'_libs/animate/animate-css.js',
		'_libs/plugins-scroll/plugins-scroll.min.js',
		'_libs/equalHeights/equalheights.min.js',
	])
	.pipe(concat('common.js'))
	.pipe(uglify()) // Minify file common.js
	.pipe(gulp.dest('_site/assets/js'))
	.pipe(gulp.dest('assets/js'));
});

/**
* Watch scss files for changes & recompile
* Watch html/md files, run jekyll & reload BrowserSync
**/
gulp.task('watch', function () {
	watch(['assets/css/**/*.sass'], function (event, cb) {
		gulp.start('style');
	});
	watch(['assets/js/**'], function (event, cb) {
		gulp.start('jekyll-rebuild');
	});
	watch(['index.html', '_layouts/*.html', '_includes/*'], function (event, cb) {
		gulp.start('jekyll-rebuild');
	});
	watch(['_jadefiles/*.jade'], function (event, cb) {
		gulp.start('jade');
	})
});

/**
* Default task, running just `gulp` will compile the sass,
* compile the jekyll site, launch BrowserSync & watch files.
**/
gulp.task('default', ['jade', 'script', 'browser-sync', 'watch']);
