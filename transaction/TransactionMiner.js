const Transaction = require('./Transaction')

class TransactionMiner{
    constructor({blockchain,transactionPool,wallet,pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub
    }

    mineTransactions(){
        const validTransactions = this.transactionPool.validTransaction()
        validTransactions.push(Transaction.rewardTransaction({minerWallet:this.wallet}))
        this.blockchain.addBlock({data:validTransactions})
        this.pubsub.broadcast()
        this.transactionPool.clear();
    }    
}

module.exports = TransactionMiner;