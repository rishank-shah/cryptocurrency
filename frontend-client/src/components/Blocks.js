import React,{Component} from 'react'
import Block from './Block'
import {Link} from 'react-router-dom'

class Blocks extends Component{
    state = {
        blocks:[]
    }

    componentDidMount(){
        fetch('http://localhost:3000/api/blocks')
        .then((res)=>res.json())
        .then(data=>{
            this.setState({blocks:data})
        })
    }


    render(){
        return(
            <div>
                <Link to='/'>Back</Link>
                <h3>BlockChain</h3>
                <div className="ml-5 mr-5">
                    {this.state.blocks.map((block)=>{
                    return(
                        <Block key ={block.hash} block={block} />
                    )
                })}
                </div>
            </div>
        )
    }
}

export default Blocks