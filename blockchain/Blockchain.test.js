const Blockchain = require('./Blockchain')
const Block = require('../block/Block')

describe('Blockchain',()=>{
    const blockchain = new Blockchain();
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
})