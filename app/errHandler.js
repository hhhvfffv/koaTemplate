class errHandler {
    async ALLError(err, ctx) {
        switch (err.data.code) {
            case "10001":
                ctx.status = 401;
                break;
            default:
                ctx.status = 500;
                break
        }

        ctx.body = err
    }
}

module.exports = new errHandler;