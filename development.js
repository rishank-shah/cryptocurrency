const { block_instance, transactionPool_instance, wallet_instance,transactionMiner_instance } = require('./routes/blockchainroutes')
const Wallet = require('./wallet/Wallet')

const wallet1 = new Wallet()
const wallet2 = new Wallet()

const generateTransaction = ({wallet,receiver, amount}) =>{
    const transaction = wallet.createTransaction({
        receiver,
        amount,
        chain:block_instance.chain
    })
    transactionPool_instance().setTransaction(transaction)
}

const walletAction = () => generateTransaction({
    wallet:wallet_instance(),
    receiver:wallet1.publicKey,
    amount:5
})

const wallet1Action = () => generateTransaction({
    wallet:wallet1,
    receiver:wallet2.publicKey,
    amount:10
})

const wallet2Action = () => generateTransaction({
    wallet:wallet2,
    receiver:wallet_instance.publicKey,
    amount:15
})

const generateData = () => {
    for (let i = 0; i <10; i++) {
        if(i%3 === 0){
            wallet1Action()
            wallet2Action()
        }else if(i%3 === 1){
            walletAction()
            wallet2Action()
        }else{
            walletAction()
            wallet1Action()
        }
        transactionMiner_instance().mineTransactions()
    }
}

module.exports = generateData