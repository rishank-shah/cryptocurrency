const express = require("express")
const router = express.Router()
const Blockchain = require('../blockchain/Blockchain')
const Wallet = require('../wallet/Wallet')
const Pubsub = require('../pubsub/Pubsub')
const TransactionPool = require('../transaction/TransactionPool')


const blockchain = new Blockchain();
const wallet = new Wallet(); 
const transactionPool = new TransactionPool();
const pubsub = new Pubsub({blockchain});

function block_instance(){ 
     return blockchain
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
     const transaction = wallet.createTransaction({
          amount,
          receiver
     })
     transactionPool.setTransaction(transaction)
     res.json({
          transaction
     });
})

module.exports = router
module.exports.block_instance = block_instance;