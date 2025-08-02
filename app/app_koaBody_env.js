const path = require('path');
const fs = require('fs');


const app_koaBody_env = async (app, koaBody) => {
    app.use(async (ctx, next) => {
        try {
            await koaBody({
                multipart: true,//是否支持multipart/form-data
                formidable: {
                    uploadDir: path.join(__dirname, '../upload'),//上传文件存放的目录
                    keepExtensions: true,//保留后缀
                    onFileBegin: (name, file) => {//文件上传过滤
                        console.log("开始上传文件");
                        //定义可以上传文件的类型
                        const rightFileType = ['.jpg', '.png', '.gif', '.docx', '.jpeg']
                        //获取文件的扩展名
                        const extname = path.extname(file.newFilename).toLocaleLowerCase()

                        //对比扩展名是否在数组中
                        if (!rightFileType.includes(extname)) {
                            file.write = () => { }
                            file.end = () => { }
                            file.on('end', () => {
                                fs.unlinkSync(file.filepath)
                            })
                            const err = new Error('文件类型不支持'); //创建错误对象
                            err.status = 403;   //设置状态码，用于读取
                            throw err; //抛出错误，触发onError  这个就是catch检测捕捉的err
                        }
                    }
                },
                parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'] //解析的请求方法，有些是默认加的，有没有的要加上
            })(ctx, next)
        } catch (err) {
            console.log(err)
            ctx.status = err.status || 500;
            ctx.body = {
                message: '上传失败',
                reslut: {
                    err: err.message
                }
            }
        }
    }
    )
}

module.exports = app_koaBody_env