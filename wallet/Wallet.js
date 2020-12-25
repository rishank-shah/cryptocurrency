const {START_BALANCE} = require('../config')
const {ec} = require('../crypto/cryptokey')
const {cryptohash} = require('../crypto/cryptohash')
const Transaction  = require('../transaction/Transaction')

class Wallet{
    constructor(){
        this.balance = START_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    sign(data){
        return this.keyPair.sign(cryptohash(data))
    }

    createTransaction({amount,receiver}){
        if(amount > this.balance){
            throw new Error("Amount exceeds Balance");
        }
        return new Transaction({sWallet:this,receiver,amount});
    }
}

module.exports = Wallet;