var assert = require('assert')
var flockPresets = require('@dwebjs/presets')
var rev = require('@dwebjs/flock')

module.exports = function(vault, opts, cb) {
    assert.ok(vault, '@dwebjs/core: lib/network  vault required')
    assert.ok(opts, '@dwebjs/core: lib/network opts required')

    var DEFAULT_PORT = 6620
    var flockOpts = Object.assign({
        hash: false,
        stream: opts.stream
    }, opts)
    var flock = disc(flockPresets(flockOpts))
    flock.once('error', function() {
        flock.listen(0)
    })
    flock.listen(opts.port || DEFAULT_PORT)
    flock.join(vault.revelationKey, { announce: !(opts.upload === false) }, cb)
    flock.options = flock._options
    return flock
}