const jwt = require('jsonwebtoken')
const { JOSN_WEB_TOKEN } = require('../config/config.default')
const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = require('../constant/err.type')
const { getUser } = require('../service/user.service')
const { PermissionsError, NOtFoundPermError } = require('../constant/err.type')
const { ROLES } = require('../constant/Permissions')

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
                    ctx.app.emit('error', TokenExpiredError, ctx)
                    break;
                case 'JsonWebTokenError':
                    ctx.app.emit('error', JsonWebTokenError, ctx)
                    break;
                case 'NotBeforeError':
                    ctx.app.emit('error', NotBeforeError, ctx)
                    break;
                default:
                    ctx.body = {
                        code: 4,
                        message: '出现未捕获错误',
                        result: {
                            err: "去厮后端吧"
                        }
                    }
                    break;
            }

            return
        }

        await next()
    }

    /**
     * 确认管理员权限
      * @param {*} Pm 权限  0 学生 1 教师 在constant/Permissions.js中定义
     */
    havePermissions(Pm) {
        //获取用户权限
        !Object.values(ROLES).includes(Pm) && (() => { return ctx.app.emit('error', NOtFoundPermError, ctx) })

        return async (ctx, next) => {
            //查看改用户权限
            const { roleName } = await getUser({ id: ctx.state.user.id })

            //拦截权限
            if (roleName !== Pm) {
                return ctx.app.emit('error', PermissionsError, ctx)
            }
            await next()
        }
    }
}

module.exports = new AuthMiddleware;