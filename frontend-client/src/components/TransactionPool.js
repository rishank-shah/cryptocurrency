import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Transaction from './Transaction'
import {Button} from 'react-bootstrap'
import history from '../history'

const POLLING_MS = 10000;

class TransactionPool extends Component{
    state = {
        transactionPool:{

        }
    }

    transactionPoolMap = () =>{
        fetch(`${document.location.origin}/api/transact-pool-map`)
        .then(res=>res.json())
        .then(data=>{
            this.setState({
                transactionPool:data
            })
        })
    }

    componentDidMount(){
        this.transactionPoolMap()
        this.transactionPoolMapInterval = setInterval(()=>
            this.transactionPoolMap()
        ,POLLING_MS)
    }

    componentWillUnmount(){
        clearInterval(this.transactionPoolMapInterval)
    }

    mineTransaction = () =>{
        fetch(`${document.location.origin}/api/mine-transaction`)
        .then(res=>{
            if(res.status===200){
                alert('Mined')
                history.push('/blocks')
            }else{
                alert('Failed')
            }
        })
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
                <hr/>
                { Object.values(this.state.transactionPool).length > 0 &&
                    <Button variant="danger" onClick={this.mineTransaction} >Mine Transactions</Button>
                }
            </div>
        )
    }
}

export default TransactionPool