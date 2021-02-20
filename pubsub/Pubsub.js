const redis = require('redis')

const CHANNELS = {
    TEST : 'TEST', 
    BLOCKCHAIN:'BLOCKCHAIN',
    TRANSACTIONPOOL:'TRANSACTIONPOOL',
};

class Pubsub{
    constructor({blockchain,transactionPool,REDIS_URL}){
        this.blockchain = blockchain
        this.transactionPool = transactionPool

        this.publisher = redis.createClient(REDIS_URL);
        this.subscriber = redis.createClient(REDIS_URL);
        
        this.subscribe();
        this.subscriber.on('message',(channel,message)=>this.handleMessage(channel,message))
    }

    subscribe(){
        Object.values(CHANNELS).forEach(channel=>{
            this.subscriber.subscribe(channel);
        })
    }

    handleMessage(channel,message){
        const mes = JSON.parse(message);

        switch(channel){
            case CHANNELS.BLOCKCHAIN: 
                this.blockchain.replaceChain(mes,true,()=>{
                    this.transactionPool.clearBlockchainTransaction({chain:mes})
                });
                break;

            case CHANNELS.TRANSACTIONPOOL: 
                this.transactionPool.setTransaction(mes);
                break;
            default: 
                return;    
        }
    }

    publish({channel,message}){
        this.subscriber.unsubscribe(channel,()=>{
            this.publisher.publish(channel,message,()=>{
                this.subscriber.subscribe(channel);
            });
        })
    }

    broadcast(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction){
        this.publish({
            channel: CHANNELS.TRANSACTIONPOOL,
            message: JSON.stringify(transaction)
        })
    }
}

module.exports = Pubsub;