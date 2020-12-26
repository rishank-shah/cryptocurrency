
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

}

module.exports = TransactionPool;