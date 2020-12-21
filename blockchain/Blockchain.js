const Block = require('../block/Block')

class Blockchain{
    constructor(){
        this.chain = [Block.genesisBlock()];
    }

    addBlock({data}){
        const new_block = Block.mineBlock({
            lastblock:this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(new_block)
    }
}

module.exports = Blockchain;