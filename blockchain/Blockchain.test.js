const Blockchain = require('./Blockchain')
const Block = require('../block/Block')

describe('Blockchain',()=>{
    let blockchain,newchain,cha;

    beforeEach(()=>{
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
            
            describe('chain is valid',()=>{
                it('returns true',()=>{
                    expect(Blockchain.isChainValid(blockchain.chain)).toBe(true)
                })
            })
        })
    });

    describe('replaceChain()',()=>{
        let error,log;
        
        beforeEach(()=>{
            error = jest.fn();
            log = jest.fn();
            global.console.error = error;
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
    })
})