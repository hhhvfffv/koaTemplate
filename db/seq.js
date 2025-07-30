const { Sequelize } = require('sequelize');
const { DATA_BASE, DB_HOST, DB_PASSWORD, DB_USER } = require('../config/config.default');

let seq;
try {
    seq = new Sequelize(DATA_BASE, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
        timezone: '+08:00',
    });
} catch (err) {
    console.error(err);
    console.error("数据库连接错误");
}

module.exports = seq;