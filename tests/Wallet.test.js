const Wallet = require('../wallet/Wallet')
const {verifySig} = require('../crypto/cryptokey')
const Transaction  = require('../transaction/Transaction')
const Blockchain = require('../blockchain/Blockchain')
const {START_BALANCE} = require('../config')

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

        describe('chain is passed',()=>{
            it('call Wallet.calculateBalance()',()=>{
                const calculateBalanceMock = jest.fn()
                const orig = Wallet.calculateBalance
                Wallet.calculateBalance = calculateBalanceMock
                wallet.createTransaction({
                    receiver:'saas',
                    amount:50,
                    chain: new Blockchain().chain
                })
                expect(calculateBalanceMock).toHaveBeenCalled();
                Wallet.calculateBalance = orig;
            });
        })
    });

    describe('calculateBalance()',()=>{
        let blockchain;

        beforeEach(()=>{
            blockchain = new Blockchain();
        })

        describe('no outputs for wallet',()=>{
            it('returns starting balance',()=>{
                expect(Wallet.calculateBalance({
                    chain:blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(START_BALANCE)
            })
        })

        describe('outputs are present',()=>{
            let transaction1, transaction2;

            beforeEach(()=>{
                transaction1 = new Wallet().createTransaction({
                    amount:50,
                    receiver:wallet.publicKey
                })

                transaction2 =  new Wallet().createTransaction({
                    amount:100,
                    receiver:wallet.publicKey
                })
                blockchain.addBlock({
                    data:[transaction1,transaction2]
                })
            })

            it('add all ouputs to wallet balance',()=>{
                expect(Wallet.calculateBalance({
                    chain:blockchain.chain,
                    address:wallet.publicKey
                }))
                .toEqual(
                    START_BALANCE + 
                    transaction1.outputMap[wallet.publicKey] + 
                    transaction2.outputMap[wallet.publicKey]
                )
            })

            describe('wallet has made transaction',()=>{
                let recentTrans ;

                beforeEach(()=>{
                    recentTrans = wallet.createTransaction({
                        amount:50,
                        receiver:'receive',
                    })

                    blockchain.addBlock({
                        data:[recentTrans]
                    })
                })

                it('returns output amount of recent trans',()=>{
                    expect(Wallet.calculateBalance({
                        chain:blockchain.chain,
                        address:wallet.publicKey
                    })).toEqual(recentTrans.outputMap[wallet.publicKey])
                })

                describe('there are outputs next to and after the recent transaction',()=>{
                    let sameBlockTrans,nextBlockTrans

                    beforeEach(()=>{
                        recentTrans = wallet.createTransaction({
                            amount:50,
                            receiver:'laterreceive',
                        })
                        sameBlockTrans = Transaction.rewardTransaction({
                            minerWallet:wallet
                        })

                        blockchain.addBlock({
                            data:[recentTrans,sameBlockTrans]
                        })

                        nextBlockTrans = new Wallet().createTransaction({
                            amount:50,
                            receiver:wallet.publicKey
                        })

                        blockchain.addBlock({
                            data:[nextBlockTrans]
                        })
                    })

                    it('includes the amount in balance',()=>{
                        expect(
                            Wallet.calculateBalance({
                                address:wallet.publicKey,
                                chain:blockchain.chain
                            })
                        ).toEqual(
                            recentTrans.outputMap[wallet.publicKey] +
                            sameBlockTrans.outputMap[wallet.publicKey] +
                            nextBlockTrans.outputMap[wallet.publicKey]
                        )
                    })
                })
            })
        })
    })
});