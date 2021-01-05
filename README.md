# CryptoCurrency 

### This project is still under development

#### This project is made using Node.js for backend , React.js for frontend and redis for sync of chains.

#### Key features:
* Sync of blockchain to peers on connect and on new mined block
* Sync of transaction pool
* Proof of work. The difficulty adjusts itself to make average mined block time 2000ms
* Mining reward
* Wallets to conduct transactions

### To run this project first start redis server
```
git clone https://github.com/rishank-shah/blockchain.git
cd blockchain
npm install
npm run start
```

### For tests
```
npm run test
```
