import React,{useEffect,useState} from 'react'

const Blocks = () =>{
    const [blocks,setBlocks] = useState('')

    useEffect(()=>{
        fetch('http://localhost:3000/api/blocks')
        .then((res)=>res.json())
        .then(data=>{
            setBlocks(JSON.stringify(data))
        })
    },[])

    return(
        <div>
            <h3>BlockChain</h3>
            {blocks}
        </div>
    )
}

export default Blocks