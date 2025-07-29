
class WsController {
    /**
 * 接收websocket上下文  处理非法信息
 * @param {*} ws 
 * @returns 
 */
    message_ws(ws) {
        //返回函数
        return async (data) => {
            console.log('收到客户端消息:', data.toString());

            const message = data.toString().trim()

            // 解析客户端回复（客户端可能发送字符串 "true" 或布尔值 true，这里统一处理）
            const clientReply = message.toLowerCase() === 'true' || data === true;

            // 如果客户端回复 true，则发送 {npm:1}
            if (clientReply) {
                ws.send(JSON.stringify({ npm: 1 })); // 注意：WebSocket 只能传字符串，需用 JSON 序列化对象
            }

            const forbiddenWords = ['非法', '攻击'];
            if (forbiddenWords.some(word => message.includes(word))) {
                console.log('检测到非法消息，服务端主动关闭连接');
                ws.close(4003, '消息包含非法内容'); // 4003 为自定义异常码  真关，同步关闭帧
                // ws.emit('close', 4003, '手动触发关闭事件');   //假关，服务端不会关，就是客户端接收不到信息，当客户端不认为关闭了
                return;
            }
        }
    }

    /**
     * 发送消息给客户端
     * @param {*} ws 
     * @param {*} message 
     */
    message_wsTwo(ws) {
        return async (data) => {
            if (data.toString().trim() === 'mm') {
                ws.send(JSON.stringify({ message: 'hello' }));
            }
        }
    }
}


module.exports = new WsController();