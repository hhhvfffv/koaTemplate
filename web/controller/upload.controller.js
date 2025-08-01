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
}

module.exports = new UploadController()