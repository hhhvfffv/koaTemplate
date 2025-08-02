const fs = require("node:fs")
const { JSDOM } = require("jsdom");
const mammoth = require("mammoth")
const path = require("path")



/**
 * （以base格式读取的图片文件，图片将存储路径）
 * @param {*} base64Data 
 * @param {*} savePath 
 * @returns 
 */
const base64ToIMG = (base64Data, savePath) => {
    return new Promise((resolve, reject) => {
        //去掉图片base64码前面部分data:image/png;base64
        const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

        //把base64码转成buffer对象，
        const dataBuffer = Buffer.from(base64, 'base64');
        //用fs写入文件
        fs.writeFile(savePath, dataBuffer, err => {
            if (err === null) {
                resolve(savePath)
            } else reject(err)
        })
    })
}


/**
 * （word路径，服务器访问的域名）
 */

let i = 0
const analyzeWord = (filePath, origin) => {
    return new Promise((resolve, reject) => {
        //要转换成html文件的路径{path: filePath}
        mammoth.convertToHtml({ path: filePath }, {
            //convertImage用于将word文件转为html
            convertImage: mammoth.images.imgElement(async image => {
                try {
                    console.log("开始处理图片，类型：", image.contentType);

                    // 1. 正确读取 base64 字符串（使用专门的 readAsBase64String 方法）
                    // 该方法返回的是不带前缀（data:image/...;base64,）的纯 base64 数据
                    const base64Data = await image.readAsBase64String();

                    // 2. 生成唯一文件名（解决异步 i 覆盖问题）
                    const filename = `${i}.png`;
                    i++; // 每次处理后递增，确保文件名唯一

                    // 3. 构造保存路径（确保 upload/image 目录存在）
                    const savePathS = path.join(__dirname, '../upload/image/', filename);
                    console.log("准备保存图片到：", savePathS);

                    // 4. 调用 base64ToIMG 保存图片（注意：需给 base64 数据添加前缀）
                    // 因为 base64ToIMG 中会移除前缀，所以这里需要先添加上
                    const fullBase64 = `data:${image.contentType};base64,${base64Data}`;
                    const Img = await base64ToIMG(fullBase64, savePathS);

                    // 5. 输出日志（此时应该能执行了）
                    console.log("图片保存路径：", Img);
                    console.log("图片转换成功");

                    return {
                        src: `${origin}/image/${path.basename(savePathS)}`
                    };
                } catch (err) {
                    // 捕获所有可能的错误，避免代码中断
                    console.error("图片处理失败：", err);
                    // 可返回一个默认图片或抛出错误（根据业务需求）
                    return { src: "error.png" };
                }
            })
            //value：转换后的 HTML 字符串，也就是 Word 文档内容对应的 HTML 结构
            //messages：转换过程中产生的消息数组（如警告、提示等
        }).then(result => {
            const parsedTree = parseHTML(result.value);
            resolve(parsedTree)
        })
            .catch(function (error) {
                reject(error)
                console.error(error);
            });
    })
}


/**
 * 传入的是，html
 */

function parseHTML(html) {
    // Node.js 环境中模拟浏览器的 DOM 环境
    const dom = new JSDOM(html);
    //这里将输入的 html 字符串转换成一个可操作的 DOM 对象，
    // 后续可以像在浏览器中一样通过 document 操作标签、文本等。
    const document = dom.window.document;

    function parseNode(node, type) {
        //比如<p class="intro">Hello <b>world</b></p> 
        //{
        //     tag: 'p',
        //         class: ['intro'],
        //             children: [
        //                 { tag: 'b', text: 'world', children: [] }
        //             ],
        //                 text: 'Hello world'
        // }
        const result = {
            tag: node.tagName ? node.tagName.toLowerCase() : undefined,
            children: []
        };

        if (type !== null && node.parentElement && node.parentElement.tagName.toLowerCase() === 'body') {
            result.type = type;
        }

        if (node.nodeType === 3) { // Node is a text node
            if (node.textContent.trim()) {
                result.text = node.textContent.trim();
            }
            return result.text ? result : null;
        }

        if (node.hasAttributes && node.hasAttributes()) {
            const attrs = node.attributes;
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (attr.name === 'class') {
                    result.class = attr.value.split(' ');
                } else {
                    result[attr.name] = attr.value;
                }
            }
        }

        let textContent = '';
        for (let child of node.childNodes) {
            const parsedChild = parseNode(child, null);
            if (parsedChild) {
                if (parsedChild.tag) {
                    result.children.push(parsedChild);
                } else if (parsedChild.text) {
                    textContent += parsedChild.text + ' ';
                }
            }
        }

        if (textContent.trim()) {
            result.text = textContent.trim();
        }

        return result;
    }

    function parseDocument(document) {
        const result = [];
        const bodyChildren = document.body.children;
        let type = 0;

        for (let i = 0; i < bodyChildren.length; i++) {
            const node = bodyChildren[i];
            if (node.tagName.toLowerCase() === 'h1') type++;
            const parsedNode = parseNode(node, type);
            result.push(parsedNode);
        }
        return result;
    }
    return parseDocument(document);
}


module.exports = {
    analyzeWord
}