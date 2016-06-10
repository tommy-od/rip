var gulp = require('gulp'),
	//sass = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	$ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'event-stream'],
		replaceString: /\bgulp[\-.]/
	}),
	folderSources   = {
		assetDir: './assets/',
		publicDir: './public/',
		bowerDir: './bower_components/'
	},
	//ES6 Stuff
	//traceur = require('gulp-traceur'),//using babel not traceur (http://weblogs.asp.net/dwahlin/getting-started-with-es6-%E2%80%93-transpiling-es6-to-es5)
	babel = require('gulp-babel'),
	plumber = require('gulp-plumber');
	//END ES6 Stuff

gulp.task('watch', function(){
    $.livereload.listen();

    gulp.watch(folderSources.assetDir + 'sass/*.scss', ['styles']);
    gulp.watch(folderSources.assetDir + 'js/*.js', ['scripts', 'babel']);
});

gulp.task('sass', function () {
	gulp.src(folderSources.assetDir + 'sass/*.scss')
		.pipe(sass().on('error', function(err) {
			console.error('Error!', err.message);
		}))
		.pipe(gulp.dest(folderSources.publicDir + 'stylesheets'))
		.pipe($.livereload());
});

gulp.task('wsClientScript', function(){
	compileScripts('ws-client.min.js');
});

gulp.task('scripts', [
	'wsClientScript'
]);

gulp.task('default', [
	'scripts',
	'sass',
	'watch'
]);

/***************
 *  Functions
 **************/
//Script compiling

function compileScripts2(minFileName, filesArray) {
	"use strict";
	var filesToMove = [
		'/assets/js/*.js'
	];
	
	gulp.task('move',['clean'], function(){
		// the base option sets the relative root for the set of files,
		// preserving the folder structure
		gulp.src(filesToMove, { base: './' })
			.pipe(gulp.dest('/public/script'));
	});
}
function compileScripts(minFileName, filesArray) {
	var concat = $.concat,
		vendorFiles,
		projectFiles;

	vendorFiles = gulp.src($.mainBowerFiles())
		.pipe($.filter('*.js'))
		.pipe($.concat('vendor.js'));

	if(typeof filesArray !== 'undefined') {
		projectFiles = gulp.src(filesArray)
			.pipe($.concat('app.js'))
			//babel
			.pipe(plumber())
			.pipe(babel());
	}

	//projectFiles won't be avail if there is no filesArray sent in, so just use vendorFiles, which is bower stuff :)
	$.eventStream.concat(vendorFiles, projectFiles || vendorFiles)
		.pipe($.order([
			'vendor.js',
			'app.js'
		]))
		.pipe(concat(minFileName))
		.pipe($.uglify())
		.pipe(gulp.dest(folderSources.publicDir + 'scripts'))
		.pipe($.livereload());
}