const express = require("express")
const router = express.Router()
const Blockchain = require('../blockchain/Blockchain')
const blockchain = new Blockchain();

router.get('/blocks',(req,res)=>{
     res.json(blockchain.chain);
});

module.exports = router