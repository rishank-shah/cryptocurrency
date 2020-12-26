const express = require('express');
const app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
const blockchainroutes = require('./routes/blockchainroutes')
const bodyparser = require('body-parser')
const request = require('request')
const {block_instance,transactionPool_instance} = require("./routes/blockchainroutes")
dotenv.config()

app.use(morgan("dev"));
app.use(bodyparser.json());

app.use('/',blockchainroutes);

let PORT;
if(process.env.PEER_PORT === 'true' ){
  PORT = 3000 + Math.ceil(Math.random()*1000)
}

const syncOnConnect = () => {
  request({url:`${process.env.ROOT_NODE}/blocks`},(err,res,body)=>{
    if(!err && res.statusCode === 200){
      blockchain = block_instance()
      const chain = JSON.parse(body);
      console.log('[INFO] Replacing chain on connect');
      blockchain.replaceChain(chain);
    }
  })

  request({url:`${process.env.ROOT_NODE}/transact-pool-map`},(err,res,body)=>{
    if(!err && res.statusCode === 200){
      transactionPool = transactionPool_instance()
      const pool = JSON.parse(body);
      console.log('[INFO] Replacing transaction on connect');
      transactionPool.replaceMap(pool);
    }
  })
}

const port = PORT || process.env.DEFAULT_PORT;
app.listen(port,()=>{
    console.log(`Node JS Api is listening on port : ${port}`);
    if(port !== process.env.DEFAULT_PORT)
    syncOnConnect();
  }    
);