module.exports = {
    get: function (res, name) {
        if (name === "") {
            res.end("foo")
        }
    },
    apply: function (res, ignore, args) {
        res.end(args[0])
    }
}