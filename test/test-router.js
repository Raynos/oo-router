var router = require(".."),
    http = require("http"),
    assert = require("assert"),
    request = require("request"),
    uri = "http://localhost:8004/"
    path = require("path")

suite("Test API", function () {
    suiteSetup(function (done) {
        http.createServer(
            router(path.join(__dirname, "routes"))
        ).listen(8004, function () {
            done()
        })
    })

    test("GET /", function (done) {
        request(uri, function (err, res, body) {
            assert(body === "foo",
                "body is incorrect")
            done()
        })
    })

    test("POST /", function (done) {
        request.post({
            uri: uri,
            json: { foo: "bar" }
        }, function (err, res, body) {
            assert(body.foo === "bar",
                "body is incorrect")
            done()
        })
    })
})