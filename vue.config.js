const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  outputDir: "./dist/client",
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map'
  }
})
