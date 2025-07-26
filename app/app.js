const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router_index = require('../router/index');
const app_koaBody_env = require('./app_koaBody_env');
const koa_static = require('koa-static');
const path = require('path');
const { ALLError } = require('./errHandler');
const koaParameter = require('koa-parameter');
const cors = require('@koa/cors');


const app = new Koa();

//注册koa-body解析路由体
app_koaBody_env(app, koaBody)
// 使用 CORS 中间件，允许所有来源
app.use(cors());
app.use(koa_static(path.join(__dirname, '../upload')))
app.use(koaParameter(app));


//注册路由
app.use(Router_index.routes())
app.use(Router_index.allowedMethods())

//全局错误监听
app.on('error', ALLError)

module.exports = app;