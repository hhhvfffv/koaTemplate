/**
 * 角色常量
 */
const ROLES = {
    STUDENT: 0,    // 学生（默认角色）
    TEACHER: 1,    // 老师
    // 如需更多角色，直接在这里添加即可，如 ASSISTANT: 3 等
};

/**
 * 单选多选
 */
const SINGLE_MULTIPLE = {
    SINGLE: false,    // 单选
    MULTIPLE: true,   // 多选
};

/**
 * 应用类型
 */
const APP_TYPE = ["操作", "考试", "作业"]

module.exports = {
    ROLES,
    SINGLE_MULTIPLE,
    APP_TYPE
};