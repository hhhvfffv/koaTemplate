const { app, server } = require('./app/app')//导入逻辑
const dotenv = require('./config/config.default');//利用npm install dotenv --save 来读全局配置文件

// 启动服务器（同时支持 HTTP 和 WebSocket）
server.listen(dotenv.APP_PORT, () => {
    console.log(`服务启动成功：http://localhost:${dotenv.APP_PORT}`);
    console.log(`WebSocket 服务已启动：ws://localhost:${dotenv.APP_PORT}`);
});