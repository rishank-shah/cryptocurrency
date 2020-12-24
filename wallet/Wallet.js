const {START_BALANCE} = require('../config')
const {ec} = require('../crypto/cryptokey')
const {cryptohash} = require('../crypto/cryptohash')

class Wallet{
    constructor(){
        this.balance = START_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    sign(data){
        return this.keyPair.sign(cryptohash(data))
    }
}

module.exports = Wallet;