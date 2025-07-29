let fs = require("fs");

/**
 * 1.http服务
 * 2.ws服务
 * @param {*} server 
 * @param {*} WebSocket 
 */
module.exports = async ({ server, WebSocket }) => {
    //自动读路由文件
    try {
        fs.readdirSync(__dirname).forEach(file => {
            if (file !== "index.js") {
                let WebSocket_ = require(__dirname + "/" + file)
                WebSocket_({ server, WebSocket })
            }
        })
    } catch (e) {
        console.error("路由文件读取失败");
        console.error(e);
    }
}