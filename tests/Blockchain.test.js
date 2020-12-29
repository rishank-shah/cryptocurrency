const Blockchain = require('../blockchain/Blockchain')
const Block = require('../block/Block')
const { cryptohash } = require("../crypto/cryptohash");
const Wallet = require('../wallet/Wallet');
const Transaction = require('../transaction/Transaction');

describe('Blockchain',()=>{
    let blockchain,newchain,cha,error;

    beforeEach(()=>{
        error = jest.fn();
        global.console.error = error;
        blockchain = new Blockchain();
        newchain = new Blockchain();
        cha = blockchain.chain;
    })

    it('contains a `chain` instance',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with gen block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesisBlock());
    });
    
    it('adds a new block to the chain',()=>{
        const data = 'data new';
        blockchain.addBlock({data});
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });

    describe('isChainValid()',()=>{
        
        describe('when chain does not have gen block',()=>{
            it('returns false',()=>{
                blockchain.chain[0] = {data:'notvalid'}
                expect(Blockchain.isChainValid(blockchain.chain)).toBe(false)
            })
        })

        describe('starts with gen block',()=>{
            
            beforeEach(()=>{
                blockchain.addBlock({data:'data1'})
                blockchain.addBlock({data:'data2'})
                blockchain.addBlock({data:'data3'})
            })

            describe('last hash reference changed',()=>{
                it('returns false',()=>{
                    blockchain.chain[1].lasthash = 'changed hash'
                    expect(Blockchain.isChainValid(blockchain.chain)).toBe(false)
                })
            })
            
            describe('chain contains block with invalid feild',()=>{
                it('returns false',()=>{
                    blockchain.chain[1].data = 'data changed'
                    expect(Blockchain.isChainValid(blockchain.chain)).toBe(false)
                })
            })

            describe('chain has jumped difficulty',()=>{
                it('returns false',()=>{
                    const lastblock = blockchain.chain[blockchain.chain.length-1];
                    const lasthash = lastblock.hash
                    const timestamp = Date.now();
                    const nonce = 1;
                    const data = []
                    const difficulty = lastblock.difficulty - 3;
                    const hash = cryptohash(timestamp,lasthash,difficulty,nonce,data);
                    const newBadBlock = new Block({
                        timestamp,
                        lasthash,
                        hash,
                        data,
                        nonce,
                        difficulty
                    })
                    blockchain.chain.push(newBadBlock)
                    expect(Blockchain.isChainValid(blockchain.chain)).toBe(false)
                })
            })
            
            describe('chain is valid',()=>{
                it('returns true',()=>{
                    expect(Blockchain.isChainValid(blockchain.chain)).toBe(true)
                })
            })
        })
    });

    describe('replaceChain()',()=>{
        let log;
        
        beforeEach(()=>{
            log = jest.fn();
            global.console.log = log;
        })
        
        describe('new chain is not long',()=>{

            beforeEach(()=>{
                newchain.chain[0] = {new:'chain'}
                blockchain.replaceChain(newchain.chain)
            })

            it('does not replace chain',()=>{
                expect(blockchain.chain).toEqual(cha)
            })

            it('log error',()=>{
                expect(error).toHaveBeenCalled();
            })
        })

        describe('chain is long',()=>{
            beforeEach(()=>{
                newchain.addBlock({data:'data1'})
                newchain.addBlock({data:'data2'})
                newchain.addBlock({data:'data3'})
            })
            describe('chain is invalid',()=>{
                beforeEach(()=>{
                    newchain.chain[2].hash = 'changed'
                    blockchain.replaceChain(newchain.chain)
                })
                it('does not replace chain',()=>{
                    expect(blockchain.chain).toEqual(cha)
                })
                
                it('log error',()=>{
                    expect(error).toHaveBeenCalled();
                })
            })
            describe('chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newchain.chain)
                })
                it('replace chain',()=>{
                    expect(blockchain.chain).toEqual(newchain.chain)
                })
                it('log replace',()=>{
                    expect(log).toHaveBeenCalled();
                })
            })
        })

        describe('the validTransaction flag is set',()=>{
            it('calls validTransactionData()',()=>{
                const validateTransactionMock = jest.fn()

                blockchain.validTransactionData = validateTransactionMock
                newchain.addBlock({
                    data:'moredata'
                })
                blockchain.replaceChain(newchain.chain,true)
                expect(validateTransactionMock).toHaveBeenCalled();
            })
        })
    })

    describe('validTransactionData()',()=>{
        let transaction, rewardTransaction,wallet;
        beforeEach(()=>{
            wallet = new Wallet()
            transaction = wallet.createTransaction({
                amount:50,
                receiver:'receive'
            })
            rewardTransaction = Transaction.rewardTransaction({
                minerWallet:wallet
            })
        })

        describe('transaction data is valid',()=>{
            it('returns true',()=>{
                newchain.addBlock({
                    data:[transaction,rewardTransaction]
                })

                expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(true)
                expect(error).not.toHaveBeenCalled()
            })
        })

        describe('transaction data is invalid',()=>{
            beforeEach(()=>{
                wallet = new Wallet()
                transaction = wallet.createTransaction({
                    amount:50,
                    receiver:'receive'
                })
                rewardTransaction = Transaction.rewardTransaction({
                    minerWallet:wallet
                })
            })

            describe('transaction data has multiple rewards',()=>{
                it('returns false and logs error',()=>{
                    newchain.addBlock({
                        data:[transaction,rewardTransaction,rewardTransaction]
                    })
                    expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(false)
                    expect(error).toHaveBeenCalled()
                })
            })
    
            describe('transaction data has malformed outputMap',()=>{
                describe('transaction is not reward',()=>{
                    it('returns false and logs error',()=>{
                        transaction.outputMap[wallet.publicKey] = 100000
                        newchain.addBlock({
                            data:[transaction,rewardTransaction]
                        })
                        expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(false)
                        expect(error).toHaveBeenCalled()
                    })
                })
                describe('transaction is reward',()=>{
                    it('returns false and logs error',()=>{
                        rewardTransaction.outputMap[wallet.publicKey] = 1000000
                        newchain.addBlock({
                            data:[transaction,rewardTransaction]
                        })
                        expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(false)
                        expect(error).toHaveBeenCalled()
                    })
                })
            })
            
            describe('transaction data has malformed input',()=>{
                it('returns false and logs error',()=>{
                    wallet.balance = 9000;
                    const wrongoutputMap = {
                        [wallet.publicKey]:8900,
                        receive : 100
                    }
                    const wrongTransaction = {
                        input:{
                            timestamp:Date.now(),
                            amount: wallet.balance,
                            address: wallet.publicKey,
                            signature: wallet.sign(wrongoutputMap)
                        },
                        outputMap:wrongoutputMap
                    }

                    newchain.addBlock({
                        data:[wrongTransaction,rewardTransaction]
                    })
                    expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(false)
                    expect(error).toHaveBeenCalled()
                })
            })
    
            describe('transaction data has multiple same data',()=>{
                it('returns false and logs error',()=>{
                    newchain.addBlock({
                        data:[transaction,transaction,transaction,rewardTransaction]
                    })
                    expect(blockchain.validTransactionData({chain:newchain.chain})).toBe(false)
                    expect(error).toHaveBeenCalled()
                })
            })
        })
    })
}) 