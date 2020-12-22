const Block = require('../block/Block')
const { cryptohash } = require('../crypto/cryptohash');

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

    static isChainValid(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())){
            return false;
        }
        for(let i=1;i<chain.length;i++){
            const block = chain[i];
            const last = chain[i-1].hash;
            const { nonce, difficulty, timestamp, lasthash,hash,data} = block;
            if(lasthash!==last)
                return false;
            const h = cryptohash(timestamp,data,lasthash,nonce,difficulty)
            if(h !== hash)
                return false;
        }
        return true;
    }
    replaceChain(ch){
        if(ch.length <= this.chain.length){
            console.error('New chain must be long')
            return;
        }
        if(!Blockchain.isChainValid(ch)){
            console.error('New chain must be valid')
            return;
        }
        console.log('Chain is replacing')
        this.chain = ch
    }
}

module.exports = Blockchain;