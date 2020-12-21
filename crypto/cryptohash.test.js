const {cryptohash} = require('./cryptohash')

describe('cryptohash()',()=>{
    const hash = "cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90"
    it('generates SHA-26',()=>{
        expect(cryptohash('testing')).toEqual(hash)
    });

    it('produces same hash for same text',()=>{
        expect(cryptohash('java','python','javasript')).toEqual(cryptohash('python','javasript','java'))
    })
})