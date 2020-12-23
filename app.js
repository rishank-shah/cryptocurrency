const express = require('express');
const app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
const blockchainroutes = require('./routes/blockchainroutes')
const bodyparser = require('body-parser')
dotenv.config()

app.use(morgan("dev"));
app.use(bodyparser.json());

app.use('/',blockchainroutes);

const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Node JS Api is listening on port : ${port}`);
  }    
);