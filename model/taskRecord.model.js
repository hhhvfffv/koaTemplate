const { DataTypes } = require('sequelize');
const seq = require('../db/seq');
const { CLASS } = require('../constant/Permissions')
const TaskItem = require('./taskItem.model');
const User = require('./user.model');

const TaskRecord = seq.define('ai_TaskRecord', {
    // 1. 任务 ID（关联 TaskItem 表的非主键 Itemid）
    task_item_id: {
        type: DataTypes.STRING, // 假设 TaskItem 的 Itemid 
        allowNull: false,
        comment: '关联 TaskItem 表的 Itemid（任务项 ID）',
        // 外键关联 TaskItem 表的 Itemid（非主键，需指定 targetKey）
        references: {
            model: TaskItem, // 关联的模型
            key: 'Task_id' // 关联 TaskItem 表的非主键字段 Itemid
        }
    },

    // 2. 完成人电话（关联 user 表的 userphone）
    user_phone: {
        type: DataTypes.STRING(20), // 电话通常为字符串（避免 leading zero 丢失）
        allowNull: false,
        comment: '完成人电话，关联 user 表的 userphone',
        // 外键关联 user 表的 userphone（非主键，需指定 targetKey）
        references: {
            model: User, // 关联的用户表模型
            key: 'user_phone' // 关联 user 表的非主键字段 userphone
        }
    },

    // 3. 完成人班级
    completion_class: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: `任务班级必须是以下之一: ${CLASS.join(', ')}`,
        validate: {
            // 自定义验证器：检查值是否在CLASS数组中
            isInClass(value) {
                if (!CLASS.includes(value)) {
                    throw new Error(`任务班级必须是以下之一: ${CLASS.join(', ')}`);
                }
            }
        }
    },

    // 4. 作答详细信息
    answer_detail: {
        type: DataTypes.JSON, // 支持长文本（如详细作答内容、步骤等）
        allowNull: false,
        comment: '作答的详细内容'
    },

    // 5. 分值
    score: {
        type: DataTypes.INTEGER, // 支持整数分值（如 95、60）
        allowNull: false,
        comment: '任务得分（整数）'
    },

    // 6. 是否及格
    is_pass: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '不及格，及格，优秀，良好，优秀'
    }
},
    {
        freezeTableName: true,
        paranoid: true,// 软删除
    });


console.log("链接成功TaskRecord");

//创建实例
try {
    // 定义关联关系（可选，根据查询需求配置）
    // 1. 关联 TaskItem：一个作答记录属于一个任务项
    TaskRecord.belongsTo(TaskItem, {
        foreignKey: 'task_item_id', // 本表的外键字段
        targetKey: 'Task_id', // 关联 TaskItem 表的字段（非主键）
    });

    // 2. 关联 User：一个作答记录属于一个用户（完成人）
    TaskRecord.belongsTo(User, {
        foreignKey: 'user_phone', // 本表的外键字段
        targetKey: 'user_phone', // 关联 User 表的字段
    });
    // TaskRecord.sync({ force: true });
} catch (err) {
    console.log(err);

    console.log("err");
}

//暴露
module.exports = TaskRecord;