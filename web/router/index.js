let fs = require("fs");

const router = require('koa-router');
const Router = new router()

//自动读路由文件
try {
    fs.readdirSync(__dirname).forEach(file => {
        if (file !== "index.js") {
            let router = require(__dirname + "/" + file)
            Router.use(router.routes())
            Router.use(router.allowedMethods())
        }
    })
} catch (e) {
    console.error("路由文件读取失败");
    console.error(e);
}

module.exports = Router