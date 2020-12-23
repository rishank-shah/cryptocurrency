const redis = require('redis')

const CHANNELS = {
    TEST : 'TEST', 
    BLOCKCHAIN:'BLOCKCHAIN'
};

class Pubsub{
    constructor({blockchain}){
        this.blockchain = blockchain
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.subscribe();
        this.subscriber.on('message',(channel,message)=>this.handleMessage(channel,message))
    }

    subscribe(){
        Object.values(CHANNELS).forEach(channel=>{
            this.subscriber.subscribe(channel);
        })
    }

    handleMessage(channel,message){
        console.log(`Message received. Channel: ${channel}. Message: ${message}`)
        const mes = JSON.parse(message);
        if(channel == CHANNELS.BLOCKCHAIN)
            this.blockchain.replaceChain(mes);
    }

    publish({channel,message}){
        //this is to not send message to same local subscriber
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
}

module.exports = Pubsub;