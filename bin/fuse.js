const {FuseBox, Sparky, UglifyESPlugin, BabelPlugin} = require('fuse-box');

let fuse;
let app;
let isProduction = false;
let variantPath;

Sparky.task('config', () => {
    fuse = FuseBox.init({
        homeDir: '../src/scripts',
        output: `../public/$name.js`,
        sourceMaps: !isProduction,
        cache: false,
        alias: {
           variants: variantPath
        },
        plugins: isProduction
            ? [UglifyESPlugin(), BabelPlugin({ presets: ['es2015'] })]
            : []
    });
    app = fuse.bundle('app').instructions(`> main.ts + ${variantPath}/**.ts`);
});

Sparky.task('set-production', () => {
    isProduction = true;
    variantPath = './variants/production';
});

Sparky.task('set-development', () => {
    variantPath = './variants/development';
});

Sparky.task('default', ['set-development', 'config'], () => {
    app.watch();
    return fuse.run();
});

Sparky.task('prod', ['set-production', 'config'], () => {
    return fuse.run();
});
