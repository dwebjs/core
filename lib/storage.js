var fs = require('fs')
var path = require('path')
var dwebStore = require(`@dwebjs/storage`)
    // var secretStorage = require(`@dwebjs/secret-storage`)
var raf = require('random-access-file')
var ram = require('random-access-memory')

module.exports = defaultStorage

/**
 * Parse the storage argument and return storage for ddrive.
 * By default, uses @dwebjs/secret-storage to storage secret keys in user's home directory.
 * @param {string|object} storage - Storage for ddrive.
 *   `string` is a directory or file. Directory: `/my-data`, storage will be in `/my-data/.dweb`.
 *   Single File: `/my-file.zip`, storage will be in memory.
 *   Object is a ddrive storage object `{metadata: fn, content: fn}`.
 * @param {object} [opts] - options
 * @param {Boolean} [opts.temp] - Use temporary storage (random-access-memory)
 * @returns {object} ddrive storage object
 */
function defaultStorage(storage, opts) {
    // Use custom storage or ram
    if (typeof storage !== 'string') return storage
    if (opts.temp) return ram
    if (opts.latest === false) {
        // Store as SLEEP files inluding content.data
        return {
            metadata: function(name, opts) {
                // I don't think we want this, we may get multiple 'ogd' sources
                // if (name === 'secret_key') return secretStorage()(path.join(storage, 'metadata.ogd'), {key: opts.key, revelationKey: opts.revelationKey})
                return raf(path.join(storage, 'metadata.' + name))
            },
            content: function(name, opts) {
                return raf(path.join(storage, 'content.' + name))
            }
        }
    }

    try {
        // Store in .dweb with secret in ~/.dweb
        if (fs.statSync(storage).isDirectory()) {
            return dwebStore(storage, opts)
        }
    } catch (e) {
        // Does not exist, make dir
        try {
            fs.mkdirSync(storage)
        } catch (e) {
            // Invalid path
            throw new Error('Invalid storage path')
        }
        return dwebStore(storage, opts)
    }
    error()

    function error() {
        // TODO: single file sleep storage
        throw new Error('Storage must be dir or opts.temp')
    }
}