import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Transaction from './Transaction'

class TransactionPool extends Component{
    state = {
        transactionPool:{

        }
    }

    transactionPoolMap = () =>{
        fetch('http://localhost:3000/api/transact-pool-map')
        .then(res=>res.json())
        .then(data=>{
            this.setState({
                transactionPool:data
            })
        })
    }

    componentDidMount(){
        this.transactionPoolMap()
    }

    render(){
        return(
            <div className="pool" >
                <Link to='/'>HomePage</Link>
                <h2 className="mt">Transaction Pool</h2>
                {
                    Object.values(this.state.transactionPool).map(transaction=>{
                        return(
                            <div key={transaction.id}>
                                <hr/>
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                { Object.values(this.state.transactionPool).length === 0 &&
                    <div>
                        <h6> No Data </h6>
                        <Link to='/transaction'>Create a Transaction</Link>
                    </div>
                }
            </div>
        )
    }
}

export default TransactionPool