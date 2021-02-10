# CryptoCurrency 

### This project is still under development

#### This project is made using Node.js for backend , React.js for frontend and redis for sync of chains.

#### Key features:
* Sync of blockchain to peers on connect and on new mined block
* Sync of transaction pool
* Proof of work. The difficulty adjusts itself to make average mined block time 2000ms
* Mining reward
* Wallets to conduct transactions

### To run this project (dev mode) first start redis server
```
https://github.com/rishank-shah/cryptocurrency.git
cd cryptocurrency
npm install
```

### Now create a .env file with the following contents
```
DEFAULT_PORT=3000
ROOT_NODE=http://localhost:3000
ENV='dev'
```

### To run project (dev mode)
```
npm run dev
```

### For tests
```
npm run test
```
