const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/constants')

const util = require('util')
const verify = util.promisify(jwt.verify)

router.prefix('/users')

// 模拟登陆
router.post('/login', async (ctx) => {
  const { userName, password } = ctx.request.body
  let userInfo = null
  // 尝试登陆
  if (userName === 'zhangsan' && password === 'abc') {
    userInfo = { userid: 1, userName: 'zhangsan', nickName: '张三' }
  }

  // 加密 userInfo
  let token = null
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, { expiresIn: '1h' })
  }

  // 登陆失败
  if (userInfo === null) {
    ctx.body = { errno: -1, msg: '登录失败' }
    return
  }
  // 登陆成功给前端返回加密的token
  ctx.body = { errno: 0, data: token }
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  try{
    // 解密token
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      errno: 0,
      userInfo: payload
    }
  }catch(e){
    console.error(e)
    ctx.body = {
      errno: -1,
      msg: 'Verify token failed.'
    }
  }
  
})

module.exports = router
