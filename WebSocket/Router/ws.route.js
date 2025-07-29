const { message_ws, message_wsTwo } = require('../controller/ws.controller');

/**
 * 1.http服务
 * 2.ws服务
 * @param {*} server 
 * @param {*} WebSocket 
 */
module.exports = ({ server, WebSocket }) => {
    try {
        // 创建 WebSocket 服务，附着在 HTTP 服务器上
        const wss = new WebSocket.Server({
            server, // 绑定到手动创建的 HTTP 服务器
            path: '/ws' // 匹配前端连接路径
        });

        // WebSocket 连接逻辑
        wss.on('connection', (ws) => {
            console.log('客户端已建立 WebSocket 连接');

            // ✅ 新增：连接后立即发询问
            ws.send('你是否要我发送信息'); // 主动发消息给客户端

            // 接收客户端消息  处理
            ws.on('message', message_ws(ws)); //分离函数
            ws.on('message', message_wsTwo(ws))

            // 连接关闭
            ws.on('close', () => {
                console.log('客户端断开 WebSocket 连接');
            });

            // 错误处理
            ws.on('error', (error) => {
                console.log('WebSocket 错误:', error);
            });
        });
    } catch (error) {
        console.log('WebSocket 服务器启动失败:', error);
        console.log(path.basename(__filename), 'websocket服务失败');

    }
}