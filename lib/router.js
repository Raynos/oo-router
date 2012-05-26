var fs = require("fs"),
    url = require("url"),
    pd = require("pd"),
    isIndex = /index.js$/,
    end = /\/$/,
    path = require("path"),
    after = require("after")

require("direct-proxies").shim({
    callback: function () {
        console.log(global.Reflect, global.Proxy)        
    }
})


var Router = {
    handle: function (req, res) {
        var pathname = url.parse(req.url).pathname,
            segments = pathname.replace(end, "").split("/"),
            last = segments.length - 1,
            body = ""

        req.on("data", function (chunk) {
            body += chunk
        })

        req.on("end", function () {
            if (req.method === "POST") {
                proxy[segments[last]](body)
            }
        })

        res.req = req
        var proxy = Proxy(res, this.module)
        if (req.method === "GET") {
            proxy[segments[last]]
        }
    }
}

module.exports = createRouter

function createRouter(uri, cb) {
    var router = pd.bindAll({}, Router)
    router.module = require(uri)
    return router.handle
}