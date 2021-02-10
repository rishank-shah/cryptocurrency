import React from "react";
import {render} from 'react-dom'
import {Router,Switch,Route} from 'react-router-dom'
import App from './components/App'
import './index.css'
import history from './history'
import Blocks from "./components/Blocks";
import ConductTrans from './components/ConductTrans'
import TransactionPool from './components/TransactionPool'

render(
    <Router history={history} >
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/blocks' component={Blocks} />
            <Route exact path='/transaction' component={ConductTrans} />
            <Route exact path='/transactionpool' component={TransactionPool} />
        </Switch>
    </Router>,
    document.getElementById('root')
)