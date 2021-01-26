import React from "react";
import {render} from 'react-dom'
import {Router,Switch,Route} from 'react-router-dom'
import App from './components/App'
import './index.css'
import history from './history'
import Blocks from "./components/Blocks";

render(
    <Router history={history} >
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/blocks' component={Blocks} />
        </Switch>
    </Router>,
    document.getElementById('root')
)