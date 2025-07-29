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
                code: 0,
                message: '上传成功',
                reslut: {
                    img_url: file.map(item => item.newFilename)
                }
            }
        } else {
            ctx.body = {
                code: 0,
                message: '上传成功',
                reslut: file.newFilename
            }
        }
    }
}

module.exports = new UploadController()