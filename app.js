// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

const joi = require('./joi-helper');

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

app.use(express.urlencoded({ extended: false }))

//一定在路由之前封装res.cc函数
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next();
})
// 在路由之前配置解析token的字符串
const expressJWT = require('express-jwt')
const config = require('./config.js')

// 
app.use(expressJWT({ secret: config.secretKey }).unless({ path: [/^\/api\//] }))


// 1 登录注册用户路由模块
// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)



// 2 用户信息的模块
// 导入并使用用户信息的模块
const ufRouter = require('./router/userinfo')
// 以斜线my开头的端口都需要token，为用户信息的路由挂载统一的访问前缀 /my/article
app.use('/my',ufRouter)



// 3 文章分类模块
// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)



//4 增添文章模块
// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)




//5 开放访问静态资源文件
app.use('/uploads', express.static('./uploads'))



// token验证错误的模块
// 错误中间件
app.use(function (err, req, res, next) {
    // 输入数据规范joi数据验证失败返回的信息
    if (err instanceof joi.ValidationError) return res.cc(err)
    // token身份认证失败后返回的错误信息  
    if ((err.name === 'UnauthorizedError')) return res.cc('身份认证失败')
    // 未知错误
    res.cc(err)
})


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(5500, function () {
    console.log('api server running at http://127.0.0.1:5500')
})

