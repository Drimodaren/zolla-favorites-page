const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const { series, parallel, watch } = require('gulp');
const del = require('del');

const paths = {
  html: {
    src: ['markup/pages/**/*.html', 'markup/*.html'],
    dest: 'dist/'
  },
  scss: {
    src: 'markup/**/*.scss',
    dest: 'dist/'
  },
  ts: {
    src: 'markup/**/*.ts',
    dest: 'dist/js/'
  },
  json: {
    src: 'markup/mock/**/*.json',
    dest: 'dist/mock/'
  },
  assets: {
    src: 'markup/assets/**/*',
    dest: 'dist/assets/'
  }
};

function clean() {
  return del(['dist/**', '!dist']);
}

function copyPagesHtml() {
  return gulp
    .src('markup/pages/**/*.html')
    .pipe(gulp.dest('dist/pages/'))
    .pipe(browserSync.stream());
}

function copyRootHtml() {
  return gulp
    .src('markup/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
}

const html = parallel(copyPagesHtml, copyRootHtml);

function styles() {
  return gulp
    .src(paths.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(paths.ts.src)
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.ts.dest))
    .pipe(browserSync.stream());
}

function json() {
  return gulp
    .src(paths.json.src)
    .pipe(gulp.dest(paths.json.dest))
    .pipe(browserSync.stream());
}

function assets() {
  return gulp
    .src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

function watchFiles() {
  watch(paths.html.src, html);
  watch(paths.scss.src, styles);
  watch(paths.ts.src, scripts);
  watch(paths.json.src, json);
  watch(paths.assets.src, assets);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
      index: 'index.html'
    },
    startPath: '/pages/personal/favorites.html',
    port: 3000,
    open: true,
    notify: false
  });

  watchFiles();
}

const build = series(clean, parallel(html, styles, scripts, json, assets));
const dev = series(build, serve);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.json = json;
exports.assets = assets;
exports.build = build;
exports.dev = dev;
exports.watch = watchFiles;
exports.default = build;
