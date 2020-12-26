const express = require("express")
const router = express.Router()
const Blockchain = require('../blockchain/Blockchain')
const Wallet = require('../wallet/Wallet')
const Pubsub = require('../pubsub/Pubsub')
const TransactionPool = require('../transaction/TransactionPool')


const blockchain = new Blockchain();
const wallet = new Wallet(); 
const transactionPool = new TransactionPool();
const pubsub = new Pubsub({blockchain,transactionPool});

function block_instance(){ 
     return blockchain
}

function transactionPool_instance(){ 
     return transactionPool
}

router.get('/blocks',(_req,res)=>{
     res.json(blockchain.chain);
});

router.post('/mine-block',(req,res)=>{
     const {data} = req.body
     blockchain.addBlock({data})
     pubsub.broadcast();
     res.redirect('/blocks')
})

router.post('/make-transaction',(req,res)=>{
     const {amount,receiver} = req.body
     if(amount < 0){
          return res.status(400).json({
               error:'Negative amount'
          })
     }
     let transaction = transactionPool.existTransact({address:wallet.publicKey});
     try{
          if(transaction){
               transaction.updateTransaction({
                    sWallet:wallet,
                    amount,
                    receiver
               })
          }
          else{
               transaction = wallet.createTransaction({
                    amount,
                    receiver
               })
          }
     }
     catch(error){
          return res.status(400).json({
               error: error.message
          })
     }
     transactionPool.setTransaction(transaction)
     pubsub.broadcastTransaction(transaction);
     res.json({
          transaction
     });
})

router.get('/transact-pool-map',(req,res)=>{
     res.json(transactionPool.transactionMap)
})

module.exports = router
module.exports.block_instance = block_instance;
module.exports.transactionPool_instance = transactionPool_instance;