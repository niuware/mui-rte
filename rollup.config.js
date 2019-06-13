import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
    input: './index.ts',
    plugins: [
        typescript(),
        commonjs({
            include: ['node_modules/**'],
            extensions: ['.js', '.ts']
        }),
        uglify()
    ],
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
    }
};