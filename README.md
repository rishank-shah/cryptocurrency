# CryptoCurrency 


#### This project is made using Node.js for backend , React.js for frontend and redis for sync of chains.

#### Key features:
* Sync of blockchain to peers on connect and on new mined block
* Sync of transaction pool
* Proof of work. The difficulty adjusts itself to make average mined block time 2000ms
* Mining reward
* Wallets to conduct transactions

### To run this project first start redis server then:
```
https://github.com/rishank-shah/cryptocurrency.git
cd cryptocurrency
npm install
cp .env.example .env
```

### Now fill the .env file 

### To run project (dev mode)
```
npm run dev
```

### To run project
```
npm run start
```

### To run all tests
```
npm run test
```

------------

### Api Endpoints:

#### GET 
- **[<code>GET</code> List Of all BLocks ](docs/GET_ALL_BLOCKS.md)**
- **[<code>GET</code> List Of BLocks (Paginated) ](docs/GET_BLOCK_BY_PAGE.md)**
- **[<code>GET</code> BlockChain Length ](docs/GET_BLOCK_LENGTH.md)**
- **[<code>GET</code> Get your wallet INFO ](docs/GET_WALLET_INFO.md)**
- **[<code>GET</code> Get List of Existing Wallet address ](docs/GET_EXISTING_WALLET.md)**
- **[<code>GET</code> Get List of latest mined block Wallet address](docs/GET_LATEST_ADDRESS.md)**
- **[<code>GET</code> Get List of transactions in Transaction Pool](docs/GET_TRANSACT_POOL.md)**
- **[<code>GET</code> Mine all Transactions Present in Transaction Pool](docs/GET_MINE.md)**

#### POST
- **[<code>POST</code> Create Transaction ](docs/POST_TRANSACTION.md)**