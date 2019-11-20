import pkg from './package.json'
// import commonjs from 'rollup-plugin-commonjs' // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import alias from '@rollup/plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
// import css from 'rollup-plugin-css-only'

const path = require('path')

const version = pkg.version
const banner = `
/*!
 * TreeVue v${version}
 * (c) ${new Date().getFullYear()} Anatoliy Ivanov
 * Released under the MIT License.
 */
`
console.log('__dirname', __dirname)

export default [
// ESM build to be used with webpack/rollup.
  {
    input: 'src/index.js', // Path relative to package.json
    output: {
      format: 'esm',
      file: pkg.module,
      name: 'TreeVue',
      exports: 'named',
      banner
    },
    plugins: [
      alias({
        resolve: ['.vue', '.js'],
        entries: {
          '@': path.resolve(__dirname, 'src')
        }
      }),
      resolve(),
      // commonjs(),
      // css(),
      vue({
        css: true // Dynamically inject css as a <style> tag
      }),
      buble({ transforms: { forOf: false } }) // Transpile to ES5
    ]
  }, {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
      format: 'iife',
      file: 'dist/tree-vue.js',
      name: 'TreeVue',
      exports: 'named',
      banner
    },
    plugins: [
      alias({
        resolve: ['.vue', '.js'],
        entries: {
          '@': path.resolve(__dirname, 'src')
        }
      }),
      resolve(),
      // commonjs(),
      // css(),
      vue({
        css: true // Dynamically inject css as a <style> tag
      }),
      buble({ transforms: { forOf: false } }) // Transpile to ES5
    ]
  }
]
