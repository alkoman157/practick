const gulp=require('gulp');
// const { src, dest } = require('gulp')
const browserSync=require('browser-sync').create();
const pug = require('gulp-pug');
//  const sass = require('gulp-sass')
const rimraf = require('rimraf');
var spritesmith=require('gulp.spritesmith');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

gulp.task('server', function(){
    browserSync.init({
        server:{
            port:9000,
            baseDir:"build"
        }
    }
    )
    gulp.watch('build/**/*').on('change', browserSync.reload);
});
// browserSync({server: true}, function(err, bs) {
//     console.log(bs.options.urls.local);
// });

gulp.task('templates:compile',function buildHTML()  {
    return gulp.src('source/templates/index.pug')
      .pipe(
        pug({
         pretty:true
        }))
      .pipe(gulp.dest('build'))
  });

  gulp.task('styles:compile', function(){
    return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
  });

  gulp.task('sprite', function(cb){
    const spriteData=gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../img/sprite.png',
      cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  })
  gulp.task('clean', function del(cb){
    return rimraf('build', cb);
  });
  gulp.task('copy:fonts', function(){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
  })

  gulp.task('copy:img', function(){
    return gulp.src('./source/img/**/*.*')
    .pipe(gulp.dest('build/img'));
  })

  gulp.task('copy', gulp.parallel('copy:fonts', 'copy:img'));

  gulp.task('watch', function(){
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  });

  gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile',  'sprite', 'copy'),
    gulp.parallel('watch', 'server')
  ));

  