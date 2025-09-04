const jwt = require('jsonwebtoken')
const { isDataSlectError } = require('../../constant/err.type')
const { JOSN_WEB_TOKEN, JOSN_DATA } = require('../../config/config.default')
const { ROLES } = require('../../constant/Permissions')
const { ROLES_SURFACE } = require('../../constant/Surface.Permissions')
const { Pub_create, Pul_findOne, Pub_update } = require('../../service/public.service')

class UserRouteClass {

    /**
     * 1.注册用户
     * @param {*} ctx 
     * @param {*} next 
     * @returns 
     */
    async register(ctx) {
        let res
        const { user_name, password, user_phone, class_name, roleName = ROLES.STUDENT } = ctx.request.body
        try {
            //判断是哪个表的
            for (const ROLES in ROLES_SURFACE) {
                if (roleName == ROLES_SURFACE[ROLES].ROLES) {
                    res = await Pub_create({ surface: ROLES_SURFACE[ROLES].SURFACE, WhereOpj: { user_name, user_phone, password, class_name, roleName } })
                    break
                }
            }
            ctx.body = {
                data: {
                    code: "0",
                    success: "注册成功",
                    data: res
                }
            }
        } catch (error) {
            console.log(error);
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
            const { roleName } = ctx.state
            let token;
            let res;

            //判断是哪个表的
            for (const ROLES in ROLES_SURFACE) {
                if (ROLES_SURFACE[ROLES].ROLES === roleName) {
                    let { password, createdAt, updatedAt, ...data } = await Pul_findOne({ surface: ROLES_SURFACE[ROLES].SURFACE, WhereOpj: { user_phone } })
                    res = data
                    console.log("用户信息：", res);
                    break
                }
            }


            token = jwt.sign(res, JOSN_WEB_TOKEN, { expiresIn: JOSN_DATA })
            //返回数据
            ctx.body = {
                data: {
                    code: "0",
                    success: "登录成功",
                    data: {
                        token,
                        res
                    }
                }
            }
        } catch (e) {
            console.error(e, "操作数据库错误或者token生成错误");
            ctx.app.emit('error_s', isDataSlectError, ctx)
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
        const { password, user_phone } = ctx.request.body
        const { roleName } = ctx.state

        try {
            let res;
            //操作数据库
            //判断是哪个表的
            for (const ROLES in ROLES_SURFACE) {
                if (ROLES_SURFACE[ROLES].ROLES === roleName) {//找到对应的表
                    res = await Pub_update({ surface: ROLES_SURFACE[ROLES].SURFACE, is: false, WhereOpj: { password }, isWhere: { user_phone } })
                    break//退出循环,找到就行
                }
            }


            //返回数据
            ctx.body = {
                data: {
                    code: "0",
                    success: "修改密码成功",
                    data: {
                        res
                    }
                }
            }

        } catch (error) {
            console.error(error);
            ctx.app.emit('error_s', isDataSlectError, ctx)
            return
        }


    }
}



//导出
module.exports = new UserRouteClass()