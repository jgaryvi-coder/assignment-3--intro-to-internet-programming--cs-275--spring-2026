let { src, dest, series, watch } = require(`gulp`),
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

let compressHTML = () => {
    return src(`./*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let lintJS = () => {
    return src(`scripts/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`scripts/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(dest(`temp/scripts`));
};

let transpileJSForProd = () => {
    return src(`scripts/*.js`)
        .pipe(babel({ presets: [`@babel/preset-env`] }))
        .pipe(jsCompressor())
        .pipe(dest(`prod/scripts`));
};

let lintCSS = () => {
    return src(`styles/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [{formatter: `string`, console: true}]
        }))
        .pipe(dest(`temp/styles`));
};

let compressCSSForProd = () => {
    return src(`styles/*.css`)
        .pipe(cssCompressor())
        .pipe(dest(`prod/styles`));
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

    watch(`scripts/*.js`, series(lintJS, transpileJSForDev)).on(`change`, reload);

    watch(`styles/*.css`, lintCSS).on(`change`, reload);

    watch(`./*.html`).on(`change`, reload);
};

let clean = async () => {
    let foldersToDelete = await deleteAsync([`./temp`, `prod`]);
    console.log(`The following directories were deleted:`, foldersToDelete);
};

exports.compressHTML = compressHTML;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintCSS = lintCSS;
exports.compressCSSForProd = compressCSSForProd;
exports.clean = clean;
exports.default = series(
    clean,
    lintCSS,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    clean,
    compressHTML,
    transpileJSForProd,
    compressCSSForProd
);
