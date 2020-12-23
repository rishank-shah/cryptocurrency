const express = require('express');
const app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()
const blockchainroutes = require('./routes/blockchainroutes')

app.use(morgan("dev"));
app.use('/',blockchainroutes);

const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Node JS Api is listening on port : ${port}`);
  }    
);