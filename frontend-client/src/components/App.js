import React,{useEffect,useState} from 'react'
import logo from '../assets/logo.png'
import {Link} from 'react-router-dom'

const App = () =>{
    const [balance,setBalance] = useState('Loading...')
    const [address,setAddress] = useState('Loading...')

    useEffect(()=>{
        fetch('http://localhost:3000/api/wallet-info')
        .then((res)=>res.json())
        .then(data=>{
            setAddress(data.address)
            setBalance(data.balance)
        })
    },[])

    return(
        <div className="app">
            <div><Link to='/blocks'>All Blocks</Link></div>
            <div><Link to='/transaction'>Conduct transaction</Link></div>
            <div> <Link to='/transactionpool'>Transaction Pool</Link> </div>
            <img className="logo" src={logo}></img>
            <br/>
            <div>Welcome</div>
            <div className="walletInfo">
                <p>Address:{address}</p>
                <p>balance:{balance}</p>
            </div>
        </div>
    )
}

export default App