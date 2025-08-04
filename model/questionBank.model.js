const { DataTypes } = require('sequelize');
const seq = require('../db/seq');
const { SINGLE_MULTIPLE } = require('../constant/Permissions')
const Teacher = require('../model/teacher.model');

const QuestionsBank = seq.define('ai_questions_bank', {
    // 题干
    topicName: {
        type: DataTypes.STRING(255),
        allowNull: false, // 必要字段，不可为null
        unique: true, // 不可重复
        comment: '题干'
    },
    // 应用类型
    applyType: {
        type: DataTypes.STRING(255),
        allowNull: false, // 必要字段，不可为null
        comment: '应用类型'
    },
    // 题目类型
    qType: {
        type: DataTypes.STRING(255),
        allowNull: false, // 必要字段，不可为null
        defaultValue: SINGLE_MULTIPLE.SINGLE, // 默认单选
        comment: '题目类型单选多选判断',
    },
    // 创建者
    create_phone: {
        type: DataTypes.STRING(11),
        allowNull: false, // 必要字段，不可为null
        references: { model: Teacher, key: 'user_phone' }, // 显式关联老师表的id
        comment: '创建者'
    },
    answer: {
        type: DataTypes.STRING(255),
        allowNull: false, // 必要字段，不可为null
        comment: '答案'
    },
    // 题目细节（题干、选项、答案，JSON结构）
    topicDetail: {
        type: DataTypes.JSON,
        allowNull: false, // 必要字段，不可为null
        comment: '题目细节（题干、选项、答案）'
    }
},
    {
        timezone: '+08:00', // 明确设置为东八区
        freezeTableName: true,
    }
)
console.log("链接成功questionBank");

//创建实例
try {
    QuestionsBank.belongsTo(Teacher, {
        foreignKey: 'create_phone', // 本表的外键字段是create_phone
        targetKey: 'user_phone' // Teacher表中被关联的字段是user_phone（非主键，必须指定）
    })

    // QuestionsBank.sync({ force: true });
    // console.log('创建成功');
} catch (err) {
    console.log(err);

    console.log("err");
}

//暴露
module.exports = QuestionsBank;