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
        let hasConductedTrans = false;

        for (let i = chain.length-1; i > 0; i--) {
            const block = chain[i];
            for(let transaction of block.data){
                if(transaction.input.address === address){
                    hasConductedTrans = true
                }
                const addressOutput = transaction.outputMap[address]
                if(addressOutput){
                    outputTotal += addressOutput
                }
            }

            if(hasConductedTrans){
                return outputTotal
            }
        }
        return hasConductedTrans ? outputTotal : START_BALANCE + outputTotal;
    }
}

module.exports = Wallet;