var assert = require('assert')
var http = require('http')
var serve = require(`@dwebjs/http`)
var debug = require('debug')('@dwebjs/core')

module.exports = function(vault, opts) {
    assert.ok(vault, 'lib/serve: vault required')
    opts = Object.assign({
        port: 8080,
        live: true,
        footer: 'Served via DWeb.'
    }, opts)

    var server = http.createServer(serve(vault, opts))
    server.listen(opts.port)
    server.on('listening', function() {
        debug(`http serving on PORT:${opts.port}`)
    })

    return server
}