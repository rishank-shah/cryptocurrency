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
}

module.exports = TransactionPool;