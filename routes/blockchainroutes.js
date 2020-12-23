const express = require("express")
const router = express.Router()
const Blockchain = require('../blockchain/Blockchain')
const Pubsub = require('../pubsub/Pubsub')

const blockchain = new Blockchain();
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

module.exports = router
module.exports.block_instance = block_instance;