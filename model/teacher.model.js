const { DataTypes } = require('sequelize');
const seq = require('../db/seq');
const { ROLES, CLASS } = require('../constant/Permissions');

const Teacher = seq.define('ai_teacher', {
    user_phone: {
        type: DataTypes.STRING(11), // 手机号固定11位，指定长度
        allowNull: false, // 必要字段，不可为null
        unique: true, // 不可重复
        comment: '用户手机号（11位数字，不可重复）',
        validate: {
            isNumeric: { // 验证是否为纯数字
                msg: '手机号必须为数字'
            },
            len: { // 验证长度是否为11位
                args: [11, 11],
                msg: '手机号必须为11位数字'
            }
        }
    },
    user_name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建用户用户可重复'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '用户密码'
    },
    roleName: {
        type: DataTypes.INTEGER,  // 改为 INTEGER 支持多角色（0、1、2...）
        allowNull: false,
        defaultValue: ROLES.TEACHER,  // 默认角色为老师
        comment: `用户角色（枚举值，可扩展）：${Object.entries(ROLES).map(([key, val]) => `${val}-${key.toLowerCase()}`).join('，')}`,
        validate: {
            // 限制角色值必须在预定义的角色枚举中（防止无效值）
            isIn: {
                args: [Object.values(ROLES)],
                msg: `角色值无效，允许的值：${Object.values(ROLES).join(', ')}等`
            }
        }
    },
    class_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: `` + `班级（枚举值）：${CLASS.join(',')}等`,
    }
},
    {
        freezeTableName: true,
    })


// //创建实例
// try {
//     Teacher.sync({ force: true });
//     console.log('创建成功');

// } catch (err) {
//     console.log("err");
// }
console.log("链接成功Teacher");


//暴露
module.exports = Teacher;