const Router = require('koa-router');
const { register, login, changPassword } = require('../controller/user.controller')
const { isUserDuplicate, encryptPassword, isRoleName, isUserLegal, isPasswordCorrect } = require('../middleWare/user.middleWare')
const { getUserTokenInfo, UserLimit } = require('../middleWare/auth.middleWare')
const { FieldValidation } = require('../ruterExpand/parameter.ruterExpand')
const { ROLES, CLASS } = require('../../constant/Permissions');



const router = new Router({ prefix: '/users' });

//注册
/**
 * 参数 user_name, user_phone, password,class_name，roleName[可选，默认学生]
 */
router.post('/register', FieldValidation({
    user_name: { type: 'string', required: true, allowEmpty: false },
    user_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },
    password: { type: 'string', required: true, allowEmpty: false },
    class_name: { type: 'enum', values: CLASS, required: true, },
    roleName: { type: 'enum', values: Object.values(ROLES), required: false, default: ROLES.STUDENT }
}), isUserDuplicate, encryptPassword, register)

//登录
/**
 * 参数 user_name user_phone  password
 */
router.post('/login', FieldValidation({
    user_name: { type: 'string', required: true, allowEmpty: false },
    user_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },
    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }
}), isUserLegal, isRoleName, isPasswordCorrect, login)

//修改密码
/**
 *参数 user_phone  password  newPassword
 */
router.patch('/password', FieldValidation({
    user_phone: { type: 'string', required: true, allowEmpty: false, format: /^1[3-9]\d{9}$/ },
    password: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 },
    newPassword: { type: 'string', required: true, allowEmpty: false, min: 6, max: 6 }
}), getUserTokenInfo, UserLimit, isRoleName, isPasswordCorrect, encryptPassword, changPassword)


module.exports = router