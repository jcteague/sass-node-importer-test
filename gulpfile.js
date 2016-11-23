/**
 * Created by johnteague on 11/5/16.
 */
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const moduleImporter = require('sass-module-importer');
const jsonImporter = require('node-sass-json-importer');
const lint = require('gulp-sass-lint');
const notify = require('gulp-notify');
const path = require('path');
const debug = require('gulp-debug');

// I tried combining into
const sassImporter = (url, prev, done) => {
  console.log('importing %s',url);
  // console.log(jsonImporter);
  jsonOutput = jsonImporter.default(url,prev);
  console.log({'json output': jsonOutput});
  if(jsonOutput){
    console.log('json');
    return jsonOutput
  }
  console.log('module importer');
  const moduleOutput= moduleImporter(url,prev);
  console.log({'module output': moduleOutput});
  return moduleOutput;
}

const config = {
    extensions: ['sass', 'scss', 'css','json'],

    sass: {
      indentedSyntax: true,
      //running two
      importer: [jsonImporter, moduleImporter()],
      sourcemap: true
    },
    autoprefixer:{
      browsers:['last 3 versions']
    },
    lint:{
      files:{
        include: 'src/**/*.scss',
        ignore: ['src/common.css'],
      },
      formatter:'stylish'
    }

};


const cssTask = () => {
  return gulp.src(['./src/**/*.{' + config.extensions + '}'])
    .pipe(sass(config.sass))
    .on('error',handleError)
    .pipe(lint(config.lint))
    .pipe(lint.format())
    .pipe(lint.failOnError())
    .on('error',handleError)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(sourcemaps.write())
/*
    .pipe(debug())
*/
    .pipe(gulp.dest('./lib/'))
    ;
};

const babelTask = ()=>{
  return gulp.src('./src/**/*.{js,jsx}')
    .pipe(babel({
      presets:['es2015','react','stage-0'],
      // module:{
      //   loaders:[
      //     { tests: /\.json$/,loader:'json'},
      //   ]
      // }

    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./lib'))

};

gulp.task('css',cssTask);
gulp.task('babel',babelTask);
gulp.task('default',['css','babel']);


const handleError = function(errorObject, callback) {
  notify.onError (errorObject.toString ().split (': ').join (':\n')).apply (this, arguments);
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit ('end');
};