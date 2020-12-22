const {GENESIS_BLOCK_DATA} = require('../config');
const { cryptohash } = require('../crypto/cryptohash');

class Block{
    constructor({timestamp,lasthash,hash,data,nonce,difficulty}){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
    
    static genesisBlock(){
        return new Block(GENESIS_BLOCK_DATA)
    }
    
    static mineBlock({lastblock,data}){
        const {difficulty} = lastblock;
        let timestamp,hash
        const lasthash = lastblock.hash;
        let nonce = 0;
        do{
            nonce ++;
            timestamp = Date.now();
            hash = cryptohash(timestamp,lasthash,data,nonce,difficulty)
        }while(hash.substring(0,difficulty)!== '0'.repeat(difficulty));

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