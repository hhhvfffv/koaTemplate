const Router = require('koa-router');
const { register, login, changPassword } = require('../controller/user.controller')
const { isUserEmpty, isUserDuplicate, encryptPassword, isUserLegal, isPasswordCorrect } = require('../middleWare/user.middleWare')
const { getUserTokenInfo } = require('../middleWare/auth.middleWare')

const router = new Router({ prefix: '/users' });

//注册
/**
 * 参数 user_name, user_phone, password, roleName[可选，默认学生]
 */
router.post('/register', isUserEmpty, isUserDuplicate, encryptPassword, register)

//登录
/**
 * 参数 user_phone  password
 */
router.post('/login', isUserEmpty, isUserLegal, isPasswordCorrect, login)

//修改密码
/**
 *参数 user_name  password  newPassword
 */
router.patch('/password', getUserTokenInfo, isPasswordCorrect, encryptPassword, changPassword)

module.exports = router