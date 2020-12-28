const Transaction = require("./Transaction");

class TransactionPool{
    constructor(){
        this.transactionMap = {}
    }
    
    existTransact({address}){
        const transactions = Object.values(this.transactionMap)
        return transactions.find(
            transaction =>
                transaction.input.address === address
            )
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    replaceMap(pool){
        this.transactionMap = pool;
    }

    validTransaction(){
        return Object.values(this.transactionMap).filter(transaction => Transaction.isValidTransaction(transaction))
    }

    clear(){
        this.transactionMap = {}
    }

    clearBlockchainTransaction({chain}){
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            if(block.data.length === 1){
                transaction = block.data;
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }else{
                for(let transaction of block.data){
                    if(this.transactionMap[transaction.id]){
                        delete this.transactionMap[transaction.id];
                    }
                }
            }
        }
    }
}

module.exports = TransactionPool;