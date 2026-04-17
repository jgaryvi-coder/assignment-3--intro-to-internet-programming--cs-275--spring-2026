let { src, dest, series, watch, parallel } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`),
    { deleteAsync } = require(`del`),
    babel = require(`gulp-babel`),
    htmlCompressor = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-uglify`),
    cssCompressor = require(`gulp-clean-css`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

let lintJS = () => {
    return src(`scripts/**/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let lintCSS = () => {
    return src(`styles/**/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [{ formatter: `string`, console: true }]
        }));
};

let transpileJSForDev = () => {
    return src(`scripts/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(dest(`temp/scripts`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `./`
            ]
        }
    });

    watch(`scripts/**/*.js`, series(lintJS, transpileJSForDev)).on(`change`, reload);
    watch(`styles/**/*.css`, lintCSS).on(`change`, reload);
    watch(`./*.html`).on(`change`, reload);
};

let compressHTML = () => {
    return src(`./*.html`)
        .pipe(htmlCompressor({ collapseWhitespace: true }))
        .pipe(dest(`prod`));
};

let transpileAndCompressJSForProd = () => {
    return src(`scripts/**/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(jsCompressor())
        .pipe(dest(`prod/scripts`));
};

let compressCSSForProd = () => {
    return src(`styles/**/*.css`)
        .pipe(cssCompressor())
        .pipe(dest(`prod/styles`));
};

let clean = async () => {
    let foldersToDelete = await deleteAsync([`./temp`, `prod`]);
    console.log(`The following directories were deleted:`, foldersToDelete);
};

exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.clean = clean;

exports.default = series(
    clean,
    parallel(lintCSS, lintJS),
    transpileJSForDev,
    serve
);

exports.build = series(
    clean,
    parallel(compressHTML, transpileAndCompressJSForProd, compressCSSForProd)
);
