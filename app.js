const express = require('express');
const app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
const blockchainroutes = require('./routes/blockchainroutes')
const bodyparser = require('body-parser')
const request = require('request')
const {block_instance} = require("./routes/blockchainroutes")
dotenv.config()

app.use(morgan("dev"));
app.use(bodyparser.json());

app.use('/',blockchainroutes);

let PORT;
if(process.env.PEER_PORT === 'true' ){
  PORT = 3000 + Math.ceil(Math.random()*1000)
}

const syncChainOnConnect = () => {
  request({url:`${process.env.ROOT_NODE}/blocks`},(err,res,body)=>{
    if(!err && res.statusCode === 200){
      blockchain = block_instance()
      const chain = JSON.parse(body);
      console.log('replcaing chain on connect');
      blockchain.replaceChain(chain);
    }
  })
}

const port = PORT || process.env.DEFAULT_PORT;
app.listen(port,()=>{
    console.log(`Node JS Api is listening on port : ${port}`);
    if(port !== process.env.DEFAULT_PORT)
      syncChainOnConnect();
  }    
);