const {GENESIS_BLOCK_DATA} = require('../config');
const { cryptohash } = require('../crypto/cryptohash');

class Block{
    constructor({timestamp,lasthash,hash,data}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
    }
    
    static genesisBlock(){
        return new Block(GENESIS_BLOCK_DATA)
    }
    
    static mineBlock({lastblock,data}){
        const timestamp = Date.now();
        const lasthash = lastblock.hash
        return new Block({
            timestamp,
            lasthash,
            data,
            hash:cryptohash(timestamp,lasthash,data)
        })
    }
}

module.exports = Block;