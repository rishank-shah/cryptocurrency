import React,{useEffect,useState} from 'react'
import Blocks from './Blocks'

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
        <div>
            <div>Welcome</div>
            <div>Address:{address}</div>
            <div>balance:{balance}</div>
            <Blocks/>
        </div>
    )
}

export default App