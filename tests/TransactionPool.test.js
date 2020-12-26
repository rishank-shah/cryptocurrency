const TransactionPool = require('../transaction/TransactionPool')
const Transaction = require('../transaction/Transaction')
const Wallet = require('../wallet/Wallet');

describe('TransactionPool',()=>{
    let transactionPool, transaction,sWallet;

    beforeEach(()=>{
        sWallet = new Wallet()
        transactionPool = new TransactionPool();
        transaction = new Transaction({
            sWallet,
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

    describe('existTransact()',()=>{
        it('returns an existing transaction',()=>{
            transactionPool.setTransaction(transaction)
            expect(transactionPool.existTransact({
                address:sWallet.publicKey
            })).toBe(transaction)
        })
    })
})