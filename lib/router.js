var fs = require("fs"),
    url = require("url"),
    pd = require("pd"),
    isIndex = /index.js$/,
    end = /\/$/,
    path = require("path"),
    after = require("after")

var ReadFolder = {
    start: function () {
        fs.readdir(this.uri, this.iterateFiles)
    },
    iterateFiles: function (err, files) {
        if (err) {
            return this.callback(err)
        }
        after.forEach(files, readFiles, this, this.callback)

        function readFiles(file, cb) {
            readFile(
                path.join(this.uri, file), 
                this.router, 
                this.path + file, 
                cb
            )
        }
    }
}

var ReadFile = {
    start: function () {
        if (isIndex.test(this.uri)) {
            return this.handleIndex()
        }
        fs.stat(uri, this.handleStat)
    },
    handleIndex: function () {
        var module = require(this.uri),
            path = this.path.replace(isIndex, "").replace(end, ""),
            paths = this.router.paths,
            segments = path.split("/"),
            last = segments.length - 1

        segments.forEach(function (segment, index) {
            if (!paths[segment]) {
                paths[segment] = index === last ? module : {}
            }
            paths = paths[segment]
        })
        this.callback()
    },
    handleStat: function (err, stats) {
        if (err) {
            return this.callback(err)
        } else if (stat.isDirectory()) {
            readFolder(this.uri, this.router, this.path, this.callback)
        } else if (stat.isFile()) {
            this.readFile()
        }
    },
    readFile: function () {
        this.callback()
    }
}

var Router = {
    handle: function (req, res) {
        var pathname = url.parse(req.url).pathname,
            segments = pathname.replace(end, "").split("/"),
            last = segments.length - 1,
            paths = this.paths,
            body = ""

        segments.forEach(function (segment) {
            paths = paths[segment]
        })


        req.on("data", function (chunk) {
            body += chunk
        })

        req.on("end", function () {
            if (req.method === "POST") {
                paths.apply(res, null, [body])
            }
        })

        res.req = req
        if (req.method === "GET") {
            paths.get(res, segments[last])
        }
    }
}

module.exports = createRouter

function createRouter(uri, cb) {
    var router = pd.bindAll({}, Router, {
        paths: {}
    })
    readFolder(uri, router, "/", function (err) {
        cb(err, router.handle)
    })
}

function readFile(uri, router, path, cb) {
    pd.bindAll({}, ReadFile, {
        uri: uri,
        router: router,
        path: path, 
        callback: cb
    }).start()
}

function readFolder(uri, router, path, cb) {
    pd.bindAll({}, ReadFolder, {
        callback: cb,
        uri: uri,
        router: router,
        path: path
    }).start()
}