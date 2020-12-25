const crypto = require('crypto')

exports.cryptohash = (...data) =>{
    const hash = crypto.createHash('sha256')
    hash.update(data.map(
        (input)=>
            JSON.stringify(input)
        ).sort().join(' '));
    return hash.digest('hex');
}
