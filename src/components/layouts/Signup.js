import React, {Component} from 'react';
import {signUp} from '../../lib/authenticationService';

class SignUp extends Component {
    state = {
        signUpFormData: {
            email: '',
            username: '',
            password: '',
            passwordConf: ''
        },
        flag: null,
        message: '',
        errorMessage: ''
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        console.log('Authenticating....');
        if (this.state.signUpFormData) {
            signUp(this.state.signUpFormData).then(response => {
                    if(response.flag === 1){
                        let formData = {
                            username: '',
                            email: '',
                            password: '',
                            passwordConf: ''
                        };
                        this.setState({message: response.message, errorMessage: '', flag: response.flag, loginFormData: formData});
                        window.location.href = 'http://localhost:3000/todo';
                    }else {
                        this.setState({message: '', errorMessage: response.message, flag: response.flag});
                    }
                }
            )
        }
    };

    handleInputChange = (evt) => {
        let formData = this.state.signUpFormData;
        formData[evt.target.name] = evt.target.value;
        this.setState({
            signUpFormData: formData
        });
    };

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group col-md-12 col-sm-12">
                        <h5 className="text-danger">{this.state.errorMessage}</h5>
                    </div>
                    <div className="form-group col-md-12 col-sm-12">
                        <label>UserName*</label>
                        <input name="username" type="text" onChange={this.handleInputChange}
                               value={this.state.signUpFormData.username}
                               className="form-control input-sm" id="name"
                               placeholder="UserName" required/>
                    </div>
                    <div className="form-group col-md-12 col-sm-12">
                        <label>Email*</label>
                        <input name="email" type="email" onChange={this.handleInputChange}
                               value={this.state.signUpFormData.email}
                               className="form-control input-sm" id="email"
                               placeholder="Email" required/>
                    </div>
                    <div className="form-group col-md-12 col-sm-12">
                        <label>Password*</label>
                        <input name="password" type="password" onChange={this.handleInputChange}
                               value={this.state.signUpFormData.password}
                               className="form-control input-sm" id="email"
                               placeholder="Password" required/>
                    </div>
                    <div className="form-group col-md-12 col-sm-12">
                        <label>Password Confirmation*</label>
                        <input name="passwordConf" type="password" onChange={this.handleInputChange}
                               value={this.state.signUpFormData.passwordConf}
                               className="form-control input-sm" id="email"
                               placeholder="Password Confirmation" required/>
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <input type="submit" className="btn btn-primary pull-right" value="Submit"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignUp;
