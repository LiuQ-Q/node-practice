var express = require('express')
var User = require('./models/user.js')

var router = express.Router()

router.get('/', function (req, res) {
  res.render('index.html')
})

router.get('/login', function (req, res) {
  res.render('login.html')
})
router.post('/login', function (req, res) {

})

router.get('/register', function (req, res) {
  res.render('register.html')
})
router.post('/register', function (req, res) {
  var body= req.body
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

    res.status(200).json({
      err_code: 0,
      foo: 'bar'
    })
  })
})


module.exports = router