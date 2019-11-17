import pkg from '../package.json'
import commonjs from 'rollup-plugin-commonjs' // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import alias from 'rollup-plugin-alias'

const path = require('path')

const version = pkg.version
const banner = `
/*!
 * TreeVue v${version}
 * (c) ${new Date().getFullYear()} Anatoliy Ivanov
 * Released under the MIT License.
 */
`

export default {
  input: 'src/wrapper.js', // Path relative to package.json
  output: {
    name: 'TreeVue',
    exports: 'named',
    banner
  },
  plugins: [
    alias({
      resolve: ['.vue', '.js'],
      '@': path.resolve(__dirname, './src')
    }),
    commonjs(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({ transforms: { forOf: false } }) // Transpile to ES5
  ]
}
