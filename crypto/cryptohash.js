const crypto = require('crypto')

exports.cryptohash = (...data) =>{
    const hash = crypto.createHash('sha256')
    hash.update(data.sort().join(' '));
    return hash.digest('hex');
}
