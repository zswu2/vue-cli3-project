const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const path = require('path')
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'
const resolve = dir => {
  return path.join(__dirname, dir)
}

// 打包性能监视
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

// 开启多线程打包
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = defineConfig({
  publicPath: './', // 所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径(之前是baseUrl，3.3之后更换了)
  outputDir: 'dist', // 输出文件目录
  assetsDir: 'static', // 放置静态文件
  lintOnSave: true, // 保存的时候做lint检查
  transpileDependencies: true,
  productionSourceMap: false, // 生产环境关闭sourcemap
  filenameHashing: true,  //生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，默认值为true
  devServer: {
    open: true, // 配置自动启动浏览器
    port: 8888, // 设置本地访问端口号
    proxy: {
      '/api': {
        target: 'http://localhost:5555', // 转发 API 请求到本地的 Node.js 服务器
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 去除 URL 中的 /api 部分
        }
      }
    }
  },
  chainWebpack: config => { 
    config.resolve.alias
      .set('@', resolve('src')) // 配置别名

    config.module   // 开启图片压缩，将大的图片进行压缩从而缩小打包体积
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({ bypassOnDebug: true })
        .end()
  },
  configureWebpack: config => {
    if(isProduction) {
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]',
              algorithm: 'gzip',
              test: new RegExp(
                  '\\.(' + productionGzipExtensions.join('|') + ')$'
              ),
              threshold: 10240, // 只有大小大于该值的资源会被处理 10240
              minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
              deleteOriginalAssets: false // 删除原文件
          })
      )
      
      // 公共代码抽离
      config.optimization = { 
        splitChunks: { 
            cacheGroups: {
                vendor: { // 外部插件
                    chunks: 'all',
                    test: /node_modules/,
                    name: 'vendor',
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100
                },
                common: { // 业务公共代码
                    chunks: 'all',
                    test: /[\\/]src[\\/]js[\\/]/,
                    name: 'common',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 60
                },
                styles: { // 样式
                    name: 'styles',
                    test: /\.(sa|sc|c)ss$/,
                    chunks: 'all',
                    enforce: true
                },
                runtimeChunk: {
                    name: 'manifest'
                }
            }
        }
      }
    }

    plugins: [
      //开启打包计时
      new SpeedMeasurePlugin(),
      new HappyPack({
          id:'babel',
          loaders:['babel-loader?cacheDirectory=true'],
          threadPool:happyThreadPool
      })     
    ]
    
  }
})
