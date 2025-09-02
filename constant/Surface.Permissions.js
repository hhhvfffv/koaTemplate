const User = require('../model/user.model')
const Teacher = require('../model/teacher.model')

/**
 * 定义角色与对应模型的映射关系
 * STUDENT:学生  ROLES:1  SURFACE:User
 * TEACHER:教师  ROLES:2  SURFACE:Teacher
 */
const ROLES_SURFACE = {
    STUDENT: { ROLES: 1, SURFACE: User },
    TEACHER: { ROLES: 2, SURFACE: Teacher },
}

module.exports = { ROLES_SURFACE }