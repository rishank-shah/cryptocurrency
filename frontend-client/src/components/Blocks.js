import React,{Component} from 'react'

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
                <h3>BlockChain</h3>
                {this.state.blocks.map((block)=>{
                    return(
                        <div key={block.hash} className="block">
                            {block.hash}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Blocks