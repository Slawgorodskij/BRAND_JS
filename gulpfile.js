// Определяем константы Gulp
const {src, dest, parallel, series, watch} = require('gulp');

// Список модулей :)
const browserSync = require('browser-sync').create(), // Перезагрузка браузера +
    include = require('gulp-file-include'), // Соединяет HTML
    htmlmin = require('gulp-htmlmin'), // Минифицирует HTML
    scss = require('gulp-sass')(require('sass')),
    cssnano = require('cssnano'), // Для минификации CSS.
    autoprefixer = require('gulp-autoprefixer'), // Добавление вендорных префексов для старых браузеров
    groupMedia = require('gulp-group-css-media-queries'), // Группировка медиазапросов и их оптимизация.
    postcss = require('gulp-postcss'), // POST CSS
    imagemin = require('gulp-imagemin'), // Сжатие картинок
    newer = require('gulp-newer'), //  для провреки фото на сжатие
    ttf2woff2 = require('gulp-ttf2woff2'),

    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify-es').default, // Минификатор JS
    webpack = require("webpack-stream"),
    webpackStream = require('webpack-stream'),

    concat = require('gulp-concat'), // Для объединения файлов и переименования
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs'),
    del = require('del'); // Удаление.
purgecss = require('@fullhuman/postcss-purgecss'); // Удаление неиспользуемых свойств CSS.

//----------------------------------------------------------------
let isProd = false; // dev by default
// Создаем два файла HTML
const htmlInclude = () => {
    return src('#src/*.html')
        .pipe(
            include({
                prefix: '@@',
            })
        )
        .pipe(dest('dist/product'))
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            })
        )
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

//Работа со стилями
const styles = () => {
    return src('#src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', notify.onError()))
        .pipe(
            autoprefixer({
                // overrideBrowserslist: ['last 5 versions'],
                // grid: true,
                cascade: false,
            })
        ) // Создадим префиксы с помощью Autoprefixer
        .pipe(groupMedia())
        .pipe(
            postcss([
                purgecss({
                    content: ['#src/**/*.html'],
                    css: ['**/*.css'],
                    //safelist: [/slick/, /button$/, /mfp/],
                }),
                cssnano(), // Минифицируем стили
            ])
        ) // Подключаем плагины для post css
        .pipe(concat('style.min.css')) // Конкатенируем в файл style.min.css
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css/')) // Выгрузим результат в папку "dist/css/"
        .pipe(browserSync.stream());
};

//Картинки
const images = () => {
    return src('#src/images/**/*') // Берём все изображения из папки источника
        .pipe(newer('dist/images/')) // Проверяем, было ли изменено (сжато) изображение ранее
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 4}),
                imagemin.svgo({
                    plugins: [{removeViewBox: false}, {cleanupIDs: false}],
                }),
            ])
        ) // Сжимаем и оптимизируем изображеня
        .pipe(dest('dist/images/')) // Выгружаем оптимизированные изображения в папку назначения
        .pipe(browserSync.stream());
};

//Шрифты
const fonts = () => {
    return src('#src/fonts/**/*') // Берём все шрифты из папки источника
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts/'))
        .pipe(browserSync.stream());
};

// JavaScript
// const scripts = () => {
//     return (
//         src('#src/js/script.js')
//             .pipe(concat('main.min.js'))
//             //.pipe(autopolyfiller('main.min.js'))
//             .pipe(uglify()) // Минификация.
//             .pipe(dest('dist/js'))
//             .pipe(browserSync.stream())
//     );
// };
//
const scripts = () => {
    return src('#src/js/**/*.js')
.pipe(concat('script.js'))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            //.pipe(uglify()) // Минификация.
            .pipe(dest('dist/js'))
            .pipe(browserSync.stream());
};



// const scripts = () => {
//     src('./#src/js/vendor/**.js')
//         .pipe(concat('vendor.js'))
//         .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
//         .pipe(dest('dist/js/'));
//     return src(
//         ['./#src/js/functions/**.js', './#src/js/components/**.js', './#src/js/script.js'])
//         .pipe(gulpif(!isProd, sourcemaps.init()))
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(concat('script.js'))
//         .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
//         .pipe(gulpif(!isProd, sourcemaps.write('.')))
//         .pipe(dest('dist/js'))
//         .pipe(browserSync.stream());
// };
//
//
// const scripts = () => {
//     return src('./#src/js/script.js')
//         .pipe(webpack({
//             mode: 'development',
//             output: {
//                 filename: 'script.js'
//             },
//             watch: false,
//             devtool: "source-map",
//             module: {
//                 rules: [
//                     {
//                         test: /\.m?js$/,
//                         exclude: /(node_modules|bower_components)/,
//                         use: {
//                             loader: 'babel-loader',
//                             options: {
//                                 presets: [['@babel/preset-env', {
//                                     debug: true,
//                                     corejs: 3,
//                                     useBuiltIns: "usage"
//                                 }]]
//                             }
//                         }
//                     }
//                 ]
//             }
//         }))
//         .pipe(dest('dist/js'))
//         .pipe(browserSync.stream());
// };


//Копирование иных файлов
const resources = () => {
    return src('#src/resources/**').pipe(dest('dist'));
};

// Удаление итоговой папки
const clear = () => {
    return del('dist');
};

// Определяем логику работы Browsersync
const serve = () => {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
        notify: false, // Отключаем уведомления
        online: true, // Режим работы сервера: true или false
    });

    watch('#src/**/*.html', htmlInclude);
    watch('#src/scss/**/*', styles);
    watch('#src/images/**/*', images);
    watch('#src/fonts/**/*', fonts);
    watch('#src/**/*.js', scripts);
    watch('#src/resources/**', resources);
};

// Экспортируем функции.

exports.images = images;
exports.serve = serve;
exports.clear = clear;
exports.styles = styles;
exports.htmlInclude = htmlInclude;
exports.fonts = fonts;
exports.scripts = scripts;

exports.default = series(
    clear,
    parallel(htmlInclude, scripts, fonts, resources, images),
    //fontsStyle,
    styles,
    serve
);

exports.build = series(clear, htmlInclude, styles, images, scripts, fonts);

//Две функции для внесения в миксин названия используемых шрифтов
// const checkWeight = (fontname) => {
//     let weight = 400;
//     switch (true) {
//         case /Thin/.test(fontname):
//             weight = 100;
//             break;
//         case /ExtraLight/.test(fontname):
//             weight = 200;
//             break;
//         case /Light/.test(fontname):
//             weight = 300;
//             break;
//         case /Regular/.test(fontname):
//             weight = 400;
//             break;
//         case /Medium/.test(fontname):
//             weight = 500;
//             break;
//         case /SemiBold/.test(fontname):
//         case /Semi/.test(fontname):
//             weight = 600;
//             break;
//         case /Heavy/.test(fontname):
//         case /Bold/.test(fontname):
//             weight = 700;
//             break;
//         case /ExtraBold/.test(fontname):
//             weight = 800;
//             break;
//         case /Black/.test(fontname):
//             weight = 900;
//             break;
//         default:
//             weight = 400;
//     }
//     return weight;
// }
//
// const cb = () => {
// }
//
// let srcFonts = './#src/scss/_fonts.scss';
// let appFonts = 'dist/fonts/';
//
// const fontsStyle = (done) => {
//     let file_content = fs.readFileSync(srcFonts);
//
//     fs.writeFile(srcFonts, '', cb);
//     fs.readdir(appFonts, function (err, items) {
//         if (items) {
//             let c_fontname;
//             for (let i = 0; i < items.length; i++) {
//                 let fontname = items[i].split('.');
//                 fontname = fontname[0];
//                 let font = fontname.split('-')[0];
//                 let weight = checkWeight(fontname)
//                 if (c_fontname !== fontname) {
//                     fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '",' + weight + ', '+ 'normal' +');\r\n', cb);
//                 }
//                 c_fontname = fontname;
//             }
//         }
//     })
//     done();
// }
// JavaScript
// const scripts = () => {
//   return src('#src/js/script.js')
//     .pipe(
//       webpackStream({
//         mode: 'development',
//         output: {
//           filename: 'main.js',
//         },
//         module: {
//           rules: [
//             {
//               test: /\.m?js$/,
//               exclude: /(node_modules|bower_components)/,
//               use: {
//                 loader: 'babel-loader',
//                 options: {
//                   presets: ['@babel/preset-env'],
//                 },
//               },
//             },
//           ],
//         },
//       })
//     )
//     .on('error', function (err) {
//       console.error('WEBPACK ERROR', err);
//       this.emit('end'); // Don't stop the rest of the task
//     })
//     .pipe(sourcemaps.init())
//     .pipe(uglify().on('error', notify.onError()))
//     .pipe(sourcemaps.write('.'))
//     .pipe(dest('dist/js'))
//     .pipe(browserSync.stream());
// };
