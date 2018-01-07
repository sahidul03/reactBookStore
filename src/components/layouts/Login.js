import React, {Component} from 'react';
import {login} from '../../lib/authenticationService';
import {getRequest} from '../../lib/common/commonApiGetway';
import config from '../../config';

class Login extends Component {
    state = {
        loginFormData: {
            username: '',
            password: ''
        },
        flag: null,
        message: '',
        errorMessage: ''
    };

    componentWillMount(){
        getRequest('/profile').then(response => {
            if(response){
                window.location.href = config.frontendBaseUrl;
            }
        })
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        console.log('Authenticating....');
        if (this.state.loginFormData) {
            login(this.state.loginFormData).then(response => {
                    if(response.flag === 1){
                        let formData = {
                            username: '',
                            password: ''
                        };
                        this.setState({message: response.message, errorMessage: '', flag: response.flag, loginFormData: formData});
                        localStorage.setItem('token', response.token);
                        window.location.href = config.frontendBaseUrl;
                    }else {
                        this.setState({message: '', errorMessage: response.message, flag: response.flag});
                    }
                }
            )
        }
    };

    handleInputChange = (evt) => {
        let formData = this.state.loginFormData;
        formData[evt.target.name] = evt.target.value;
        this.setState({
            loginFormData: formData
        });
    };

    render() {
        return (
            <div className="container">
                <form className="form-signin" onSubmit={this.handleSubmit}>

                    <h5 className="text-danger">{this.state.errorMessage}</h5>
                    <h2 className="form-signin-heading">Please sign in</h2>
                    <label className="sr-only">Email address</label>
                    <input name="username" onChange={this.handleInputChange}
                           type="text" id="inputEmail"
                           value={this.state.loginFormData.username}
                           className="form-control" placeholder="Email address" required/>
                    <br/>
                    <label className="sr-only">Password</label>
                    <input name="password" onChange={this.handleInputChange}
                           type="password" id="inputPassword"
                           value={this.state.loginFormData.password}
                           className="form-control" placeholder="Password" required/>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="remember-me"/> Remember me
                        </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                </form>
            </div>
        );
    }
}

export default Login;
