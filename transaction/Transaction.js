const { v1: uuidv1 } = require('uuid');
const { verifySig } = require('../crypto/cryptokey');

class Transaction{
    constructor({sWallet, receiver,amount}){
        this.id = uuidv1();
        this.outputMap = this.createOutput({sWallet, receiver,amount})
        this.input = this.createInput({sWallet,outputMap:this.outputMap});
    }

    createOutput({sWallet, receiver,amount}){
        const outputMap = {};
        outputMap[receiver] = amount;
        outputMap[sWallet.publicKey] = sWallet.balance - amount;
        return outputMap;
    }

    createInput({sWallet,outputMap}){
        return {
            timestamp: Date.now(),
            amount: sWallet.balance,
            address: sWallet.publicKey,
            signature: sWallet.sign(outputMap)
        };
    }

    static isValidTransaction(transaction){
        const {input:{address,amount,signature}, outputMap} = transaction;
        const outputTotal = Object.values(outputMap).reduce((total,outputAmount)=> total+outputAmount);

        if(amount !== outputTotal){
            //console.log(`Invalid transaction from ${address}`)
            return false;
        }

        if(!verifySig({publicKey:address,data:outputMap,signature})){
            //console.log(`Invalid signature from ${address}`)
            return false;
        }
        return true;
    }

    updateTransaction({sWallet,amount,receiver}){
        if(amount > this.outputMap[sWallet.publicKey]){
            throw new Error('Amount exceeds Balance');
        }

        if(!this.outputMap[receiver]){
            this.outputMap[receiver] = amount;
        }
        else{
            this.outputMap[receiver] += amount;
        }
        this.outputMap[sWallet.publicKey] -= amount;
        this.input = this.createInput({
            sWallet,
            outputMap:this.outputMap
        }); 
    }
}

module.exports = Transaction;