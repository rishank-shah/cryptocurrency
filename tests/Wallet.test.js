const Wallet = require('../wallet/Wallet')
const {verifySig} = require('../crypto/cryptokey')
const Transaction  = require('../transaction/Transaction')

describe('Wallet',()=>{
    let wallet;
    
    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has `balance`',()=>{
        expect(wallet).toHaveProperty('balance');
    })

    it('has `publicKey`',()=>{
        expect(wallet).toHaveProperty('publicKey');
    })

    describe('sign data',()=>{
        const data = 'test data';

        it('verify signature',()=>{
            expect(
                verifySig({
                    publicKey:wallet.publicKey,
                    data,
                    signature:wallet.sign(data)
                })
            ).toBe(true);
        });

        it('if invalid then dont verify',()=>{
            expect(
                verifySig({
                    publicKey:wallet.publicKey,
                    data,
                    signature:new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })

    describe('createTransaction()',()=>{
        describe('amount exceeds balance',()=>{
            it('throws an error',()=>{
                expect(()=>
                    wallet.createTransaction({
                        amount:10000000,
                        receiver:'receive'
                    })
                ).toThrow('Amount exceeds Balance')
            })
        });

        describe('amount valid',()=>{

            let transaction,amount,receiver

            beforeEach(()=>{
                amount = 0.005;
                receiver = "receive";
                transaction = wallet.createTransaction({amount,receiver})
            })

            it('creates an instance of `Transaction` ',()=>{
                expect(transaction instanceof Transaction).toBe(true);
            })
            
            it('matches the transaction input with wallet',()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey);
            })

            it('outputs the amount to receiver',()=>{
                expect(transaction.outputMap[receiver]).toEqual(amount);
            })
        })
    });
});