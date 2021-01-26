import React,{ Component } from "react";
import {Button} from 'react-bootstrap'
import Transaction from './Transaction'

class Block extends Component{
    state = {
        displayTrans: false
    }

    toggleTrans = () =>{
        this.setState({
            displayTrans: !this.state.displayTrans
        })
    }

    get displayTrans() {
        const { data } = this.props.block;
        const stringifiedData = JSON.stringify(data);
        const dataDisplay = stringifiedData.length > 50 ?
          `${stringifiedData.substring(0, 50)}...` :
          stringifiedData;
    
        if (this.state.displayTrans) {
          return (
            <div>
              {
                data.map(transaction => (
                  <div key={transaction.id}>
                    <Transaction transaction={transaction} />
                  </div>
                ))
              }
              <br />
              <Button
                className="btn-danger btn-sm"
                onClick={this.toggleTrans}
              >
                Show Less
              </Button>
            </div>
          )
        }
    
        return (
          <div>
            <div>Data: {dataDisplay}</div>
            <Button
              className="btn-danger btn-sm"
              onClick={this.toggleTrans}
            >
              Show More
            </Button>
          </div>
        );
      }


    render(){
        const {timestamp,hash} = this.props.block;

        const hashDisplay = `${hash.substring(0,50)}...`;

        return(
            <div className='block'>
                <div>
                    Hash: {hashDisplay}
                </div>
                <div>
                    timestamp: {new Date(timestamp).toLocaleString()}
                </div>
                {this.displayTrans}
            </div>
        )
    }
}

export default Block;