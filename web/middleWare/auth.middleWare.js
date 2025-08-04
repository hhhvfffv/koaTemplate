const jwt = require('jsonwebtoken')
const { JOSN_WEB_TOKEN } = require('../../config/config.default')
const { TokenExpiredError, JsonWebTokenError, NotBeforeError, isAllError, PermissionsError, NOtFoundPermError } = require('../../constant/err.type')
const { getUser } = require('../service/user.service')
const { Pul_findOne } = require('../../service/public.service')
const User = require('../../model/user.model')
const Teacher = require('../../model/teacher.model')
const { ROLES } = require('../../constant/Permissions')

class AuthMiddleware {

    /**
     * 1.用户的信息提取
     * 2.验证token
     * @param {*} ctx 
     * @param {*} next 
     * @returns 
     */
    async getUserTokenInfo(ctx, next) {
        //获取   会有私有前缀 要分隔

        const token = ctx.request.header.authorization.split(' ')[1];

        try {
            //验证token
            let user = jwt.verify(token, JOSN_WEB_TOKEN)
            //将用户信息存入ctx.state
            ctx.state.user = user;
        } catch (err) {
            console.error(err);
            switch (err.name) {
                case 'TokenExpiredError':
                    ctx.app.emit('error_s', TokenExpiredError, ctx)
                    break;
                case 'JsonWebTokenError':
                    ctx.app.emit('error_s', JsonWebTokenError, ctx)
                    break;
                case 'NotBeforeError':
                    ctx.app.emit('error_s', NotBeforeError, ctx)
                    break;
                default:
                    ctx.body = {
                        data: {
                            code: 4,
                            message: 'token中间件出现未捕获错误',
                            data: {
                                err: "去厮后端吧"
                            }
                        }
                    }
                    break;
            }

            return
        }

        await next()
    }

    /**
     * 确认管理员权限 需要tokrn中间件
      * @param {*} Pm 权限  0 学生 1 教师 在constant/Permissions.js中定义
     */
    havePermissions(Pm) {
        //获取用户权限
        !Object.values(ROLES).includes(Pm) && (() => { return ctx.app.emit('error_s', NOtFoundPermError, ctx) })

        return async (ctx, next) => {
            //查看改用户权限
            let roleName

            let res1 = await Pul_findOne({ surface: Teacher, WhereOpj: { user_phone: ctx.state.user.user_phone } })
            let res2 = await Pul_findOne({ surface: User, WhereOpj: { user_phone: ctx.state.user.user_phone } })

            if (res1 && res2) { return (ctx.app.emit('error_s', isAllError, ctx)) }


            res1 && (roleName = ROLES.TEACHER)
            res2 && (roleName = ROLES.STUDENT)



            //拦截权限
            if (roleName !== Pm) {
                return ctx.app.emit('error_s', PermissionsError, ctx)
            }
            await next()
        }
    }
}

module.exports = new AuthMiddleware;