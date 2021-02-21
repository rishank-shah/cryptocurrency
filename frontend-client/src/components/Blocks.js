import React,{Component} from 'react'
import Block from './Block'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

class Blocks extends Component{
    state = {
        blocks:[],
        pageNumber: 1,
        totalLength:0
    }

    componentDidMount(){
        fetch(`${document.location.origin}/api/block/length`)
        .then((res)=>res.json())
        .then(data=>{
            this.setState({totalLength:data.length})
        })
        this.pageNumberBlocks(this.state.pageNumber)
    }

    pageNumberBlocks = number =>{
        fetch(`${document.location.origin}/api/blocks/${number}`)
        .then((res)=>res.json())
        .then(data=>{
            this.setState({blocks:data})
        })
    }

    render(){
        return(
            <div>
                <div><Link to='/'>Home Page</Link></div>
                <div><Link to='/transaction'>Conduct transaction</Link></div>
                <h3>BlockChain</h3>
                <div className="ml-5 mr-5">
                    {this.state.blocks.map((block)=>{
                    return(
                        <Block key ={block.hash} block={block} />
                    )
                })}
                </div>
                <div>
                    {
                       [...Array(Math.ceil(this.state.totalLength/5)).keys()].map(key=>{
                           const id = key+1;
                           return (
                                <span key={key} onClick={()=>this.pageNumberBlocks(id)} >
                                    <Button variant="danger" size="small">{id}</Button>{' '}
                                </span>
                           )
                       })
                    }
                </div>
            </div>
        )
    }
}

export default Blocks