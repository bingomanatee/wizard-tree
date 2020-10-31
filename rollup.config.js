import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import * as react from 'react';
import * as reactDom from 'react-dom';
import * as reactIs from 'react-is';
import * as propTypes from 'prop-types';
import pkg from './package.json';

module.exports = {
  input: 'src/index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/env', '@babel/preset-react'],
      plugins: [
        [
          '@babel/plugin-proposal-class-properties',
          {
            loose: true,
          },
        ],
      ],
    }),
    commonjs({
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom),
        'react-is': Object.keys(reactIs),
        'prop-types': Object.keys(propTypes),
      },
    }),
    terser(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'MyRoot',
  },
};
