const Wallet = require('../wallet/Wallet')

describe('Wallet',()=>{
    let wallet;
    
    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has `balance`',()=>{
        expect(wallet).toHaveProperty('balance');
    })

    it('has `publicKey`',()=>{
        expect(wallet).toHaveProperty('publicKey');
    })
});