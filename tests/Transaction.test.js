const { verifySig } = require('../crypto/cryptokey');
const Transaction = require('../transaction/Transaction')
const Wallet = require('../wallet/Wallet')

describe('Transaction',()=>{
    let transaction,sWallet,receiver,amount;
    beforeEach(()=>{
        sWallet = new Wallet();
        receiver = 'receiver';
        amount = 0.05;

        transaction = new Transaction({sWallet, receiver,amount})
    });
    it('has `id`',()=>{
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap',()=>{
        it('has an `output`',()=>{
            expect(transaction).toHaveProperty('outputMap');
        })

        it('outputs the amount of receiver',()=>{
            expect(transaction.outputMap[receiver]).toEqual(amount)
        })

        it('outputs the rem balance of the `sWallet` ',()=>{
            expect(transaction.outputMap[sWallet.publicKey]).toEqual(sWallet.balance - amount)
        })
    })

    describe('input',()=>{
        it('has an `input`',()=>{
            expect(transaction).toHaveProperty
            ('input');
        });

        it('has a `timestamp`',()=>{
            expect(transaction.input).toHaveProperty('timestamp')
        });

        it('sets amount to sWallet balance',()=>{
            expect(transaction.input.amount).toEqual(sWallet.balance);
        });

        it('sets address to sWallet publicKey',()=>{
            expect(transaction.input.address).toEqual(sWallet.publicKey);
        });

        it('sign input',()=>{
            expect(
                verifySig({
                    publicKey: sWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true)
        })
    })

    describe('isValidTransaction()',()=>{
        describe('valid',()=>{
            it('return true',()=>{
                expect(Transaction.isValidTransaction(transaction)).toBe(true)
            })
        })

        describe('invalid',()=>{
            describe('outputmap is invalid',()=>{
                it('return false',()=>{
                    transaction.outputMap[sWallet.publicKey] = 1000;
                    expect(Transaction.isValidTransaction(transaction)).toBe(false)
                })
            })
            describe('input signature is invalid',()=>{
                it('return false',()=>{
                    transaction.input.signature = new Wallet().sign('data');
                    expect(Transaction.isValidTransaction(transaction)).toBe(false)
                })
            })
        })
    })
})
