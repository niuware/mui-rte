import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: './src/MUIRichTextEditor.tsx',
    plugins: [
        typescript(),
        commonjs({
            include: ['node_modules/**'],
            extensions: ['.js', '.ts']
        }),
        process.env.NODE_ENV === "production" && uglify()
    ],
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: process.env.NODE_ENV === "development"
    }
};