const path = require('node:path');
const esbuild = require('esbuild');

async function build() {
    try {
        await esbuild.build({
            entryPoints: [path.resolve(__dirname, '../src/react/index.jsx')],
            bundle: true,
            outfile: path.resolve(__dirname, '../src/renderer-bundle.js'),
            platform: 'browser',
            target: ['chrome120'],
            format: 'esm',
            sourcemap: process.env.NODE_ENV !== 'production',
            define: {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            },
            loader: {
                '.svg': 'dataurl',
            },
        });
        console.log('✅ Renderer bundle built successfully');
    } catch (error) {
        console.error('❌ Failed to build renderer bundle:', error);
        process.exit(1);
    }
}

build();
