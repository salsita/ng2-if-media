export default {
  entry: 'dist/lib/index.js',
  dest: 'dist/bundles/ng2IfMedia.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.ifMedia',
  globals: {
    '@angular/core': 'ng.core'
  }
}
