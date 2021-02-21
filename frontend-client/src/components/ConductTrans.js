import React,{Component} from 'react'
import {FormGroup,FormControl,Button} from 'react-bootstrap'
import {Link,Redirect} from 'react-router-dom'

class ConductTrans extends Component{
    state = {
        receiver:'',
        amount:0,
        redirect:false,
        latestAddress:[]
    }

    componentDidMount(){
        const {receiver,amount} = this.state
        fetch(`${document.location.origin}/api/latest-address`)
        .then((res)=>res.json())
        .then(data=>this.setState({
            latestAddress:data
        }))
    }

    setAmount = e =>{
        if(Number(e.target.value)){
            this.setState({
                amount:Number(e.target.value)
            })
        }else{
            this.setState({
                amount:0
            })
        }
    }

    setReceiver = e =>{
        this.setState({
            receiver:e.target.value
        })
    }

    conductTransaction = () =>{
        const {receiver,amount} = this.state
        fetch(`${document.location.origin}/api/make-transaction`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                receiver,
                amount
            })
        })
        .then((res)=>res.json())
        .then(data=>{
            if(data.error === 'Amount exceeds Balance' ){
                alert('Please enter amount within balance')
            }else{
                alert(`Sent ${receiver} ${amount} coins`)
                this.setState({
                    redirect:true
                })
            }
        })
    }

    render(){
        if(this.state.redirect){
            return <Redirect to="transactionpool" />
        }
        return(
            <div className="conduct" >
                <div><Link to='/'>Home Page</Link></div>
                <div> <Link to='/transactionpool'>Transaction Pool</Link> </div>
                <h2 className="mt">Conduct Transaction</h2>
                <FormGroup>
                    <FormControl style={{color:"cyan"}} input="text" placeholder="Receiver" value={this.state.receiver} onChange={this.setReceiver} autoFocus />
                </FormGroup>
                <FormGroup>
                    <FormControl style={{color:"cyan"}} input="number" placeholder="Amount" value={this.state.amount} onChange={this.setAmount} />
                </FormGroup>
                <div>
                    <Button variant="danger" onClick={this.conductTransaction} >Submit</Button>
                </div>
                <hr/>
                <h4>Latest Wallet Address</h4>
                {this.state.latestAddress.map(address=>{
                    return(
                        <div key={address}>
                            <div>
                                {address==='undefined' ? '':address }
                            </div>
                            <br/>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ConductTrans