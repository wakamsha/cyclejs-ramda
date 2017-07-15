const {FuseBox} = require('fuse-box');
const argv = require('yargs').argv;

const dev = argv.variant === 'dev';

const fuse = FuseBox.init({
    homeDir: 'src/scripts',
    output: `public/$name.js`,
    sourceMaps: dev,
    cache: dev
});

const app = fuse.bundle('app').instructions('> main.ts');

dev && app.watch();

fuse.run();
