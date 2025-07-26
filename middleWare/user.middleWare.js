const { isUserRepeat, isUserHaveNull, userRegisterError, isUserNotExist, isDataSlectError, isPasswordError, passwordFormatisincorrect } = require('../constant/err.type')
const { getUser } = require('../service/user.service')
const bcrypt = require('bcryptjs')

/**
     * 1.验证用户是否为空
     * @param {Object} ctx 请求上下文对象
     * @param {Function} next 回调函数
     */
const isUserEmpty = async (ctx, next) => {
    const { user_name, user_phone, password } = ctx.request.body;
    switch (ctx.URL.pathname) {
        //判断参数必要性
        case '/users/login':
            if (!password || !user_phone) {
                ctx.body = "不能为空"
                ctx.app.emit('error', isUserHaveNull, ctx)
                return
            }
            break
        case '/users/register':
            if (!user_name || !password || !user_phone) {
                ctx.body = "不能为空"
                ctx.app.emit('error', isUserHaveNull, ctx)
                return
            }
            break
    }


    if (!(/^1[3-9]\d{9}$/.test(user_phone))) return ctx.app.emit('error', passwordFormatisincorrect, ctx)
    await next()
}

/**userRegisterError
 * 2.查重->查询用户是否存在
 */
const isUserDuplicate = async (ctx, next) => {
    const { user_phone } = ctx.request.body;
    // 数据库查询用户是否存在
    try {
        if (await getUser({ user_phone })) {
            ctx.body = "用户名已存在"
            ctx.app.emit('error', isUserRepeat, ctx)
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error', userRegisterError, ctx)
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
        return ctx.app.emit('error', userRegisterError, ctx)
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
        if (!await getUser({ user_phone })) {
            ctx.app.emit('error', isUserNotExist, ctx)
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error', isDataSlectError, ctx)
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
        //2.获得数据库用户信息  
        const User_infomation = await getUser({ user_phone });
        console.log(User_infomation.password);
        console.log(password);


        //3.解密
        if (!bcrypt.compareSync(password, User_infomation.password)) {
            ctx.app.emit('error', isPasswordError, ctx)
            console.log(bcrypt.compareSync(password, User_infomation.password));
            return
        }
    } catch (err) {
        console.error(err);
        ctx.app.emit('error', isDataSlectError, ctx)
        return
    }


    await next()
}



module.exports = {
    isUserEmpty,    // 验证用户是否为空
    isUserDuplicate,// 验证用户是否重复
    encryptPassword,//3.用户密码加密
    isUserLegal,    //4.用户合法性验证
    isPasswordCorrect //5.密码验证

}