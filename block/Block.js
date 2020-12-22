const {GENESIS_BLOCK_DATA, RATE} = require('../config');
const { cryptohash } = require('../crypto/cryptohash');
const hexBinary = require('hex-to-binary')

class Block{
    constructor({timestamp,lasthash,hash,data,nonce,difficulty}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    static difficulty({block,timestamp}){
        const {difficulty} = block;
        if(difficulty<1) 
            return 2;
        const diff = timestamp - block.timestamp;
        if(diff>RATE)
            return difficulty - 1;
        return difficulty + 1;
    }
    
    static genesisBlock(){
        return new Block(GENESIS_BLOCK_DATA)
    }
    
    static mineBlock({lastblock,data}){
        let {difficulty} = lastblock;
        let timestamp,hash
        const lasthash = lastblock.hash;
        let nonce = 0;
        do{
            nonce ++;
            timestamp = Date.now();
            difficulty = Block.difficulty({block:lastblock,timestamp})
            hash = cryptohash(timestamp,lasthash,data,nonce,difficulty)
        }while(hexBinary(hash).substring(0,difficulty)!== '0'.repeat(difficulty));

        return new Block({
            timestamp,
            lasthash,
            data,
            difficulty,
            nonce,
            hash
        })
    }
}

module.exports = Block;