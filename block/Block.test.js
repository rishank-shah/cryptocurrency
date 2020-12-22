const Block = require("./Block");
const { GENESIS_BLOCK_DATA } = require("../config");
const { cryptohash } = require("../crypto/cryptohash");

describe('Block',()=>{
    const timestamp = "time";
    const lasthash = 'lasthash';
    const data = ['data1','data2'];
    const hash = 'hash';
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({
        timestamp,
        lasthash,
        data,
        hash,
        nonce,
        difficulty
    });

    it('has timestamp, lasthash, hash, data, nonce, difficulty',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lasthash).toEqual(lasthash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })

    describe('genesisBlock()',()=>{
        const gen = Block.genesisBlock();
        it('returns a Block instance',()=>{
            expect(gen instanceof Block).toBe(true);
        })
        it('returns the genesis data',()=>{
            expect(gen).toEqual(GENESIS_BLOCK_DATA)
        })
    })

    describe('mineBlock()',()=>{
        const lastblock = Block.genesisBlock();
        const data = 'mined data';
        const mined = Block.mineBlock({lastblock,data})
        it('returns a Block instance',()=>{
            expect(mined instanceof Block).toBe(true);
        })
        it('sets the `lasthash` to be the `hash` of the lastblock',()=>{
            expect(mined.lasthash).toEqual(lastblock.hash);
        });
        it('sets the `data`',()=>{
            expect(mined.data).toEqual(data);
        });
        it('sets a `timestamp` ',()=>{
            expect(mined.timestamp).not.toEqual(undefined)
        });
        it('creates `hash` on proper inputs',()=>{
            expect(mined.hash).toEqual(cryptohash(mined.timestamp,mined.nonce,mined.difficulty,lastblock.hash,data))
        });
        it('sets `hash` ',()=>{
            expect(mined.hash.substring(0,mined.difficulty)).toEqual('0'.repeat(mined.difficulty))
        })
    });
});