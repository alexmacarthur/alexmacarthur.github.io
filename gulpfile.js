var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var autoprefix  = require('gulp-autoprefixer');
var sass        = require('gulp-sass');
var rename      = require("gulp-rename");
var concat      = require('gulp-concat');
var jekyll      = process.platform === "win32" ? "jekyll.bat" : "jekyll";
var browserSync = require('browser-sync');
var ghPages     = require('gulp-gh-pages');
var cp          = require('child_process');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// build Jekyll site
gulp.task('build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
  .on('close', done);
});

// rebuild site,
gulp.task('rebuild', ['build'], function () {
  browserSync.reload();
});

// wait for a build, then restart the server
gulp.task('browserSync', ['sass','scripts','build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// check JavaScript
gulp.task('jshint',function(){
  gulp.src('assets/js/main.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// concat and minify our JavaScript
gulp.task('scripts', function() {
  gulp.src(['assets/js/typeit.js','assets/js/scrollify.js','assets/js/main.js','assets/js/fracs.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

// compile sass, reload browser
gulp.task('sass',function(){
  gulp.src('assets/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

// watch for changes & stuff
gulp.task('watch', function () {
  gulp.watch('assets/scss/**/*.scss', ['sass', 'rebuild']);
  gulp.watch(['index.html', '_layouts/*', '_includes/*', '_posts/*', '_drafts/*'], ['rebuild']);
  gulp.watch('assets/js/*', ['scripts','rebuild']);
});

// compile everything, build Jekyll site, launch browserSync
gulp.task('default', ['browserSync', 'watch']);
