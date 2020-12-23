const express = require("express")
const router = express.Router()
const Blockchain = require('../blockchain/Blockchain')
const blockchain = new Blockchain();

router.get('/blocks',(_req,res)=>{
     res.json(blockchain.chain);
});

router.post('/mine-block',(req,res)=>{
     const {data} = req.body
     blockchain.addBlock({data})
     res.redirect('/blocks')
})

module.exports = router