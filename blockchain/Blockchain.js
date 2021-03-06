const Block = require('../block/Block')
const { cryptohash } = require('../crypto/cryptohash');
const {REWARDINPUT, MININGREWARD} = require('../config');
const Transaction = require('../transaction/Transaction')
const Wallet = require('../wallet/Wallet')

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
            const lastDiff = chain[i-1].difficulty;

            if(Math.abs(difficulty - lastDiff)>1)
                return false;

            if(lasthash!==last)
                return false;
            const h = cryptohash(timestamp,data,lasthash,nonce,difficulty)
            if(h !== hash)
                return false;
        }
        return true;
    }

    replaceChain(ch,validateTransaction,onSuccess){
        if(ch.length <= this.chain.length){
            console.error('[ERROR] New chain must be long')
            return;
        }
        if(!Blockchain.isChainValid(ch)){
            console.error('[ERROR] New chain must be valid')
            return;
        }
        if(validateTransaction && !this.validTransactionData({chain:ch})){
            console.error('[ERROR] New chain must have valid transaction data')
            return;
        }
        if(onSuccess) onSuccess();
        console.log('[INFO] Chain is replacing')
        this.chain = ch
    }

    validTransactionData({chain}){
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set()
            let rewardTransCount = 0;
            for(let transaction of block.data){
                if(transaction.input.address === REWARDINPUT.address){
                    rewardTransCount += 1
                    if(rewardTransCount>1){
                        console.error('[ERROR] Miner rewards exceeds limit')
                        return false
                    }
                    if(Object.values(transaction.outputMap)[0] !== MININGREWARD){
                        console.error('[ERROR] Miner rewards amount exceeds limit')
                        return false
                    }
                }else{
                    if(!Transaction.isValidTransaction(transaction)){
                        console.error('[ERROR] Invalid transaction')
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        address:transaction.input.address,
                        chain:this.chain
                    })

                    if(transaction.input.amount !== trueBalance){
                        console.error('[ERROR] Invalid input amount')
                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        console.error('[ERROR] Multiple transactions in one block')
                        return false;
                    }else{
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        return true;
    }
}

module.exports = Blockchain;