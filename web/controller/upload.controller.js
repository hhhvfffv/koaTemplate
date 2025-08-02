const path = require('path')
const { analyzeWord } = require('../../tool/util')
const dotenv = require('../..//config/config.default');//利用npm install dotenv --save 来读全局配置文件
const { isExtnameERROR } = require('../../constant/err.type')

class UploadController {
    async upload(ctx) {
        /**
         * 1.获取上传文件
         * 2.返回给请求端，用于回显
         */
        const file = ctx.request.files.file
        //判断是否为数组
        if (file instanceof Array) {
            ctx.body = {
                data: {
                    code: 0,
                    success: '上传成功',
                    data: {
                        img_url: file.map(item => item.newFilename)
                    }
                }
            }
        } else {
            ctx.body = {
                data: {
                    code: 0,
                    success: '上传成功',
                    data: file.newFilename
                }
            }
        }
    }

    /**
     * 
     */
    async parse(ctx) {
        const file = ctx.request.files.file.newFilename
        //刚刚上传的，文件路径
        const path_s = path.join(__dirname, '../../upload', file)

        if (!(path.extname(path_s) === '.docx')) {
            return ctx.app.emit('error_s', isExtnameERROR, ctx)
        }

        //解析word文件 返回数组
        const hrml_doc = await analyzeWord(path_s, dotenv.LOCALHOST_URL)
        ctx.body = {
            data: {
                code: 0,
                success: '上传成功',
                data: hrml_doc
            }
        }

    }
}

module.exports = new UploadController()