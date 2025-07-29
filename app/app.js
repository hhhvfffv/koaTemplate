const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router_index = require('../web/router/index');
const app_koaBody_env = require('./app_koaBody_env');
const koa_static = require('koa-static');
const path = require('path');
const { ALLError } = require('./errHandler');
const koaParameter = require('koa-parameter');
const cors = require('@koa/cors');
const http = require('http'); // Node 内置的 http 模块
const WebSocket = require('ws'); // 引入 ws 库
const WebSocket_index = require('../WebSocket/Router/index'); // 引入 WebSocket 路由处理



const app = new Koa();

// 手动创建 HTTP 服务器（替代 Koa 内部自动创建的服务器）
const server = http.createServer(app.callback());

// 注册 ws 服务 逻辑
WebSocket_index({ server, WebSocket })


//注册koa-body解析路由体
app_koaBody_env(app, koaBody)
// 使用 CORS 中间件，允许所有来源
app.use(cors());
app.use(koa_static(path.join(__dirname, '../upload'))) //访问根路由直接加静态资源名字
app.use(koaParameter(app));


//注册路由
app.use(Router_index.routes())
app.use(Router_index.allowedMethods())

//全局错误监听
app.on('error', ALLError)

module.exports = { app, server }; // 导出 app 和 server 以便在 main.js 中使用
