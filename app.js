var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router.js')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true // 无论是否使用 session 默认给 session
}))

// 配置解析 POST 请求体插件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 把路由挂在到 app 中
app.use(router)


app.listen(3000, function () {
  console.log('running...')
})