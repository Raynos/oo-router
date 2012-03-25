# OO-router

a HTTP router based on an OO interface

## <a href="#concept" name="concept">Concept</a>

The HTTP verbs mean

    OPTIONS -> return the valid HTTP verbs on the URI
    HEAD -> GET without the body
    POST -> invoke the function
    PUT -> assign a property
    PATCH -> partial update a property
    DELETE -> delete a property
    GET -> get the property

## <a href="#routes" name="routes">Routes constructed</a>

     /routes/
       index.js
       name.js
       foo.js
       bar/
         foo.js
         index.js

Generates

    / (index.js)
    /name (name.js)
    /foo (foo.js)
    /bar (bar/index.js)
    /bar/foo (bar/foo.js)

## <a href="#api" name="api">Routes API</a>

    // index.js
    module.exports = {
        deleteProperty: function (res, name) {
            // res.req === req
            // DELETE /name
        },
        get: function (res, name) {
            // GET /name
        },
        has: function (res, name) {
            // HEAD /name
        },
        set: function (res, name, body) {
            // PUT /name body
        },
        apply: function (res, ignoreReceiver, args) {
            // POST /name args[0]
        }
    }