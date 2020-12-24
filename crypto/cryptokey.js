const EC = require('elliptic').ec;
const {cryptohash} = require('./cryptohash')

const ec = new EC('secp256k1');

const verifySig = ({publicKey,data,signature})=>{
    const key = ec.keyFromPublic(publicKey,'hex');
    return key.verify(cryptohash(data),signature)
}

module.exports = {ec,verifySig}