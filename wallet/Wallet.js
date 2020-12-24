const {START_BALANCE} = require('../config')
const {ec} = require('../crypto/cryptokey')

class Wallet{
    constructor(){
        this.balance = START_BALANCE;
        const keyPair = ec.genKeyPair();
        this.publicKey = keyPair.getPublic().encode('hex');
    }
}

module.exports = Wallet;