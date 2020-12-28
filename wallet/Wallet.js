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

    createTransaction({amount,receiver,chain}){
        if(chain){
            this.balance = Wallet.calculateBalance({
                chain,
                address:this.publicKey
            })
        }
        if(amount > this.balance){
            throw new Error("Amount exceeds Balance");
        }
        return new Transaction({sWallet:this,receiver,amount});
    }

    static calculateBalance({address,chain}){
        let outputTotal = 0;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            for(let transaction of block.data){
                const addressOutput = transaction.outputMap[address]
                if(addressOutput){
                    outputTotal += addressOutput
                }
            }
        }
        return START_BALANCE + outputTotal;
    }
}

module.exports = Wallet;