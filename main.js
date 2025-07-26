const app = require('./app/app')//导入逻辑
const dotenv = require('./config/config.default');//利用npm install dotenv --save 来读全局配置文件

app.listen(dotenv.APP_PORT, () => {
    console.log(`http://localhost:${dotenv.APP_PORT}`);
})