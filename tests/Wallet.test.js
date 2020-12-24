const Wallet = require('../wallet/Wallet')
const {verifySig} = require('../crypto/cryptokey')

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

    describe('sign data',()=>{
        const data = 'test data';

        it('verify signature',()=>{
            expect(
                verifySig({
                    publicKey:wallet.publicKey,
                    data,
                    signature:wallet.sign(data)
                })
            ).toBe(true);
        });

        it('if invalid then dont verify',()=>{
            expect(
                verifySig({
                    publicKey:wallet.publicKey,
                    data,
                    signature:new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })
});