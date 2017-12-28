import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import {Router} from './components/router';
import registerServiceWorker from './registerServiceWorker';
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom';
import {About} from './components/others/About';
import {Home} from './components/others/Home';
import {Topics} from './components/others/Topics';
import Login from './components/layouts/Login';
import SignUp from './components/layouts/Signup';
import {logout} from './lib/authenticationService';
import {loggingStatus} from './lib/authenticationService';

let initializationHeaderMenu = false;
let isLoggedIn = false;
setTimeout(() => {
    loggingStatus().then(response => {
        initializationHeaderMenu = true;
        if(response.flag === 1){
            isLoggedIn = true;
        }
    })
}, 10);

function logoutSubmit() {
    logout().then(response => {
        if(response.flag === 1){
            window.location.href = 'http://localhost:3000/login';
        }
    })
}

ReactDOM.render(
    <Router>
        <div className="container">
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <NavLink className="navbar-brand" to="/">Task Manager</NavLink>
                        {/*<a class="navbar-brand" href="#">Project name</a>*/}
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li><NavLink activeClassName="headerMenuActive" exact={true} to="/">Home</NavLink></li>
                            <li><NavLink activeClassName="headerMenuActive" to="/about">About</NavLink></li>
                            <li><NavLink activeClassName="headerMenuActive" to="/topics">Topics</NavLink></li>
                            <li><NavLink activeClassName="headerMenuActive" to="/todo">Todo</NavLink></li>
                            <li><NavLink activeClassName="headerMenuActive" to="/login">Login</NavLink></li>
                            <li><NavLink activeClassName="headerMenuActive" to="/signup">SignUp</NavLink></li>
                            <li><a className="logoutButton" onClick={logoutSubmit}>Logout</a></li>
                            {/*<li class="dropdown">*/}
                            {/*<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>*/}
                            {/*<ul class="dropdown-menu">*/}
                            {/*<li><a href="#">Action</a></li>*/}
                            {/*<li><a href="#">Another action</a></li>*/}
                            {/*<li><a href="#">Something else here</a></li>*/}
                            {/*<li role="separator" class="divider"></li>*/}
                            {/*<li class="dropdown-header">Nav header</li>*/}
                            {/*<li><a href="#">Separated NavLink</a></li>*/}
                            {/*<li><a href="#">One more separated NavLink</a></li>*/}
                            {/*</ul>*/}
                            {/*</li>*/}
                        </ul>
                        {/*<ul class="nav navbar-nav navbar-right">*/}
                        {/*<li class="active"><a href="./">Default <span class="sr-only">(current)</span></a></li>*/}
                        {/*<li><a href="../navbar-static-top/">Static top</a></li>*/}
                        {/*<li><a href="../navbar-fixed-top/">Fixed top</a></li>*/}
                        {/*</ul>*/}
                    </div>
                </div>
            </nav>

            <div className="jumbotron">
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/todo" component={App}/>
                <Route path="/topics" component={Topics}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={SignUp}/>
            </div>
        </div>
    </Router>,
    document.getElementById('root'));
registerServiceWorker();
