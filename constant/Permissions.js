
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
    SINGLE: "单选",    // 单选
    MULTIPLE: "多选",   // 多选
    JUDGE: "判断",      // 判断题
};

/**
 * 应用类型
 */
const APP_TYPE = ["操作", "安全", "规范"]

/**
 * 班级
 */
const CLASS = ["一班", "二班", "三班", "四班", "五班", "六班", "七班", "八班", "九班", "十班"];

module.exports = {
    ROLES,
    SINGLE_MULTIPLE,
    APP_TYPE,
    CLASS,
};