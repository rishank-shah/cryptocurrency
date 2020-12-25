const {cryptohash} = require('../crypto/cryptohash')

describe('cryptohash()',()=>{
    const hash = "c8b61ec034d17530b93c32e49e0d98eb7b27225cba9fbea927212a9d6ab0a5ce"
    it('generates SHA-26',()=>{
        expect(cryptohash('testing')).toEqual(hash)
    });

    it('produces same hash for same text',()=>{
        expect(cryptohash('java','python','javasript')).toEqual(cryptohash('python','javasript','java'))
    });

    it('produces diff hash when properties are changed',()=>{
        const a = {};
        const ahash = cryptohash(a);
        a['b'] = 'b'
        expect(cryptohash(a)).not.toEqual(ahash)
    })
})