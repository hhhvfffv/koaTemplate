const User = require('../model/user.model')
const { ROLES } = require('../constant/Permissions')

// 1.创建用户
const createUser = async ({ user_name, user_phone, password, roleName = ROLES.STUDENT }) => {
    try {
        const res = await User.create({ user_name, user_phone, password, roleName })
        return res.dataValues
    } catch (err) {
        console.error(err)
        console.error('添加用户失败');
    }
}

//2.用户查询
const getUser = async ({ user_name, user_phone, id, roleName, createAt, updatedAt }) => {
    const where = {}

    //条件加入
    user_name ? Object.assign(where, { user_name }) : null
    user_phone ? Object.assign(where, { user_phone }) : null
    id ? Object.assign(where, { id }) : null
    roleName ? Object.assign(where, { roleName }) : null
    createAt ? Object.assign(where, { createAt }) : null
    updatedAt ? Object.assign(where, { updatedAt }) : null

    //查询
    try {
        const res = await User.findOne({
            attributes: ['id', 'user_name', 'user_phone', 'password', 'roleName', 'createdAt', 'updatedAt'],
            where: where
        })
        return res ? res.dataValues : null
    } catch (err) {
        console.error(err)
        console.error('查询错误');
    }

}

//3.用户条件更新
const updateUser = async ({ id, user_name, user_phone, password, roleName }) => {
    //要更新的内容
    const updateData = {}
    //条件  一般都是按id
    const WhereOpj = { id }

    //要改的内容
    user_name ? Object.assign(updateData, { user_name }) : null
    user_phone ? Object.assign(updateData, { user_phone }) : null
    password ? Object.assign(updateData, { password }) : null
    roleName ? Object.assign(updateData, { roleName }) : null


    const res = await User.update(
        updateData, //更新内容
        {
            where: WhereOpj
        }
    )

    return res[0] //返回更新的条数
}





module.exports = {
    createUser, // 1.创建用户
    getUser,    //2.用户查询
    updateUser //3.用户条件更新
}