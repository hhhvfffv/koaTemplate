const { DataTypes } = require('sequelize');
const seq = require('../db/seq');
const { CLASS } = require('../constant/Permissions')
const Teacher = require('./teacher.model');

const TaskItem = seq.define('ai_TaskItem', {
    Task_id: {
        type: DataTypes.STRING,
        unique: true, // 不可重复
        allowNull: false,
        comment: '任务id'

    },
    Task_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '任务名称'
    },
    Task_class: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '任务班级',
        validate: {
            // 自定义验证器：检查值是否在CLASS数组中
            isInClass(value) {
                if (!CLASS.includes(value)) {
                    throw new Error(`任务班级必须是以下之一: ${CLASS.join(', ')}`);
                }
            }
        }
    },
    Task_profile: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '任务描述'
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: '任务数据'
    },
    create_phone: {
        type: DataTypes.STRING(11),
        unique: true, // 不可重复
        allowNull: false,
        comment: '创建者手机号',
        references: {
            model: Teacher, // 关联的模型
            key: 'user_phone' // 关联 Teacher 表的非主键字段 user_phone
        }
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '任务结束时间'
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '任务状态'
    },

    is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否公开,公开就没有截至时间'
    },
    wait_num:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '等待完成人数'
    },
    finish_num:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '完成人数'
    },
},
    {
        timezone: '+08:00', // 明确设置为东八区
        freezeTableName: true,
        paranoid: true,// 软删除
        hooks: {
            beforeCreate: (taskItem, options) => {   // 创建前的钩子函数
                console.log(taskItem, options);
            },
            beforeUpdate: (taskItem, options) => {   // 更新前的钩子函数
                console.log(taskItem, options);
            }
        }
    }
)
console.log("链接成功TaskItem");

//创建实例
try {
    TaskItem.belongsTo(Teacher, {
        foreignKey: 'create_phone', // 本表的外键字段是create_phone
        targetKey: 'user_phone' // Teacher表中被关联的字段是user_phone（非主键，必须指定）
    })

    // TaskItem.sync({ force: true });
    // console.log('创建成功');
} catch (err) {
    console.log(err);

    console.log("err");
}

//暴露
module.exports = TaskItem;