var express = require('express')
var User = require('./models/user.js')

var router = express.Router()

/* 首页 */
router.get('/', function (req, res) {
  res.render('index.html', {
    user: req.session.user
  })
})

/* 登录 */
router.get('/login', function (req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res) {
  var body = req.body

  User.findOne({
    email: body.email,
    password: body.password
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务端错误'
      })
    }

    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'email or passward is invalid'
      })
    }

    // 用户存在 记录登录状态
    req.session.user = user

    return res.status(200).json({
      err_code: 0,
      message: 'OK'
    })

  })
})

/* 注册 */
router.get('/register', function (req, res) {
  res.render('register.html')
})
router.post('/register', function (req, res) {
  var body = req.body
  // console.log(body) ok
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务端错误'
      })
    }
    if (data) {
      // 邮箱或昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: '邮箱或昵称已存在'
      })
    }

    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: '数据库存储错误...'
        })
      }

      // 注册成功, 使用 Session 记录用户的登录状态
      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })

      // 服务端重定向至针对同步请求 异步请求无效
      // res.redirect('/')
    })

  })
})

/* 退出 */
router.get('/logout', function (req, res) {
  // 清楚登录状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')

})



module.exports = router