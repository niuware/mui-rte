import fs from 'node:fs';
import path from 'node:path';
import ttypescript from 'ttypescript';
import nodeGlobals from 'rollup-plugin-node-globals';
import cleaner from 'rollup-plugin-cleaner';
import typescriptPlugin from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import tsTransformPaths from '@zerollup/ts-transform-paths';
import { dependencies, peerDependencies } from './package.json';

const extensions = ['.js', '.tsx', '.ts'];

const external = [
  ...Object.keys({
    ...peerDependencies,
    ...dependencies,
  }),
].map((str) => new RegExp(`^${str}`));

const cleanerOptions = {
  targets: ['./dist'],
};

const resolveOptions = { preferBuiltins: false, extensions };

const babelOptions = {
  exclude: /node_modules/,
  babelHelpers: 'bundled',
  extensions: ['.js', '.ts', '.tsx'],
  presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
};

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
  namedExports: {
    '../../node_modules/prop-types/index.js': [
      'elementType',
      'bool',
      'func',
      'object',
      'oneOfType',
      'element',
    ],
    '../../node_modules/react/jsx-runtime.js': ['jsx', 'jsxs'],
    '../../node_modules/react-is/index.js': [
      'ForwardRef',
      'isFragment',
      'isLazy',
      'isMemo',
      'Memo',
      'isValidElementType',
    ],
  },
};

const typescriptOptions = {
  typescript: ttypescript,
  transformers: [(service) => tsTransformPaths(service.getProgram())],
  exclude: ['src/mocks/**/*', 'src/stories/**/*'],
};

const findIndexFiles = (directoryPath, fileList = []) => {
  return fs.readdirSync(directoryPath).reduce((fileList, file) => {
    const filePath = path.join(directoryPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      return [...fileList, ...findIndexFiles(filePath)];
    }

    // Check if the file name matches the required format
    if (/^index(\.tsx?)?$/.test(file)) {
      return [...fileList, filePath];
    }

    return fileList;
  }, []);
};

export default [
  {
    external,
    input: findIndexFiles('src'),
    output: [
      {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
      },
    ],
    plugins: [
      cleaner(cleanerOptions),
      peerDepsExternal(),
      commonjs(commonjsOptions),
      nodeResolve(resolveOptions),
      nodeGlobals(),
      typescriptPlugin(typescriptOptions),
      babel(babelOptions),
      terser(),
    ],
  },
];
