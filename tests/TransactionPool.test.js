const TransactionPool = require('../transaction/TransactionPool')
const Transaction = require('../transaction/Transaction')
const Wallet = require('../wallet/Wallet');

describe('TransactionPool',()=>{
    let transactionPool, transaction;

    beforeEach(()=>{
        transactionPool = new TransactionPool();
        transaction = new Transaction({
            sWallet : new Wallet(),
            receiver: 'receive',
            amount: 0.005
        })
    })

    describe('setTransaction()',()=>{
        it('adds transaction',()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction)
        })
    })
})