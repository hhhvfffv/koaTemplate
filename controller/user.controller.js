const { createUser } = require('../service/user.service')
const jwt = require('jsonwebtoken')
const { isDataSlectError } = require('../constant/err.type')
const { JOSN_WEB_TOKEN, JOSN_DATA } = require('../config/config.default')
const { getUser, updateUser } = require('../service/user.service')
const { ROLES } = require('../constant/Permissions')

class UserRouteClass {

    /**
     * 1.注册用户
     * @param {*} ctx 
     * @param {*} next 
     * @returns 
     */
    async register(ctx) {
        const { user_name, password, user_phone, roleName = ROLES.STUDENT } = ctx.request.body
        try {
            const res = await createUser({ user_name, user_phone, password, roleName })
            ctx.body = {
                code: "0",
                message: "注册成功",
                result: {
                    id: res.id,
                    user_name: res.user_name,
                    user_phone: res.user_phone,
                    roleName: res.roleName,
                }
            }

        } catch (e) {
            console.error("操作数据库错误");
            return
        }
    }

    /**
     * 1.登录并返回信息
     * 2.返回token给请求端
     * @param {*} ctx 
     * @param {*} next 
     * @returns 
     */
    async login(ctx, next) {

        //返回token
        try {
            const { user_phone } = ctx.request.body
            let token;
            const { password, createdAt, updatedAt, ...res } = await getUser({ user_phone })
            token = jwt.sign(res, JOSN_WEB_TOKEN, { expiresIn: JOSN_DATA })
            //返回数据
            ctx.body = {
                code: "0",
                message: "登录成功",
                result: {
                    token,
                    user_name: res.user_name,
                    user_phone: res.user_phone,
                    isAdmin: res.isAdmin,
                }
            }
        } catch (e) {
            console.error(e, "操作数据库错误或者token生成错误");
            ctx.app.emit('error', isDataSlectError, ctx)
            return
        }


    }

    /**
     * 1.修改密码
     * 2.操作数据库
     * @param {*} ctx 
     * @param {*} next 
     * @returns 
     */
    async changPassword(ctx, next) {
        // 更改
        const { id } = ctx.state.user
        const { password } = ctx.request.body

        try {
            //操作数据库
            await updateUser({ id, password })
        } catch (error) {
            console.error(error);
            ctx.app.emit('error', isDataSlectError, ctx)
            return
        }

        ctx.body = {
            code: "0",
            message: "修改密码成功",
        }
    }
}



//导出
module.exports = new UserRouteClass()