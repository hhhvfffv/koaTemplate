const { isUserRepeat, userRegisterError, isUserNotExist, isDataSlectError, isPasswordError } = require('../../constant/err.type')
const { getUser } = require('../service/user.service')
const { Pul_findOne } = require('../../service/public.service')
const User = require('../../model/user.model')
const Teacher = require('../../model/teacher.model')
const { ROLES } = require('../../constant/Permissions')
const bcrypt = require('bcryptjs')

/**userRegisterError
 * 2.查重->查询用户是否存在
 */
const isUserDuplicate = async (ctx, next) => {
    const { user_phone, roleName } = ctx.request.body;
    // 数据库查询用户是否存在
    try {
        // 两个表任意一个存在都不行
        if ((await Pul_findOne({ surface: Teacher, WhereOpj: { user_phone } }))
            || (await Pul_findOne({ surface: User, WhereOpj: { user_phone } }))) {
            ctx.app.emit('error_s', isUserRepeat, ctx)
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error_s', userRegisterError, ctx)
        return
    }
    await next()
}

/**
 * 1.写入数据库之前，密码加密
 * 2.分情况，修改密码和注册用户
 * 3.修改密码时要加密的是新密码，然后执行存入数据库
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const encryptPassword = async (ctx, next) => {
    try {
        let password
        switch (ctx.URL.pathname) {
            //修改密码
            case '/users/password':
                password = ctx.request.body.newPassword
                break
            default:
                password = ctx.request.body.password
                break
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        //挂载回去
        ctx.request.body.password = hash;

    } catch (err) {
        console.error(err);
        return ctx.app.emit('error_s', userRegisterError, ctx)
    }
    await next()
}

/**
 * 查找用户是否存在，合法
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const isUserLegal = async (ctx, next) => {
    //1.获得数据
    const { user_phone } = ctx.request.body;
    //2.查找用户是否存在
    try {
        let res
        let res1 = await Pul_findOne({ surface: Teacher, WhereOpj: { user_phone } })
        let res2 = await Pul_findOne({ surface: User, WhereOpj: { user_phone } })


        res1 ? res = res1 : res = res2

        if (!res) {
            ctx.app.emit('error_s', isUserNotExist, ctx)
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error_s', isDataSlectError, ctx)
        return
    }


    await next()
}

/**
 * 1.密码验证
 * 2.把数据库的密码拿出来解析，然后和用户输入的密码进行比对
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const isPasswordCorrect = async (ctx, next) => {
    try {
        //1.获得数据
        const { password, user_phone } = ctx.request.body;
        const { roleName } = ctx.state //只有登录用户查重才有
        //2.获得数据库用户信息  
        let User_infomation

        //判断是哪个表的
        switch (roleName) {
            case ROLES.TEACHER: {
                User_infomation = await Pul_findOne({ surface: Teacher, WhereOpj: { user_phone } })
                break
            }
            case ROLES.STUDENT: {
                User_infomation = await Pul_findOne({ surface: User, WhereOpj: { user_phone } })
                break
            }
        }

        if (!User_infomation) {
            ctx.app.emit('error_s', isUserNotExist, ctx)
            return
        }

        console.log(User_infomation.password);
        console.log(password);


        //3.解密
        if (!bcrypt.compareSync(password, User_infomation.password)) {
            ctx.app.emit('error_s', isPasswordError, ctx)
            console.log(bcrypt.compareSync(password, User_infomation.password));
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error_s', isDataSlectError, ctx)
        return
    }


    await next()
}

/**
 * 用户角色判断，会把对应角色挂载到ctx.state.roleName上
 * 需要user_phone参数  body参数
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const isRoleName = async (ctx, next) => {
    const { user_phone } = ctx.request.body;

    try {
        let res1 = await Pul_findOne({ surface: Teacher, WhereOpj: { user_phone } })
        let res2 = await Pul_findOne({ surface: User, WhereOpj: { user_phone } })

        res1 ? ctx.state.roleName = ROLES.TEACHER : ""
        res2 ? ctx.state.roleName = ROLES.STUDENT : ""
        await next()
    } catch (error) {
        console.error(err);
        ctx.app.emit('error_s', isDataSlectError, ctx)
        return
    }
}


module.exports = {
    isUserDuplicate,// 验证用户是否重复
    encryptPassword,//3.用户密码加密
    isUserLegal,    //4.用户合法性验证
    isPasswordCorrect, //5.密码验证
    isRoleName, //6.角色判断
}