import React, {Component} from 'react';
import {signUp} from '../../lib/authenticationService';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {getRequest} from '../../lib/common/commonApiGetway';
import config from '../../config';

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

  componentWillMount() {
    getRequest('/profile').then(response => {
        if(response){
            window.location.href = config.frontendBaseUrl;
        }
    })
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('Authenticating....');
    if (this.state.signUpFormData) {
      signUp(this.state.signUpFormData).then(response => {
          if (response.flag === 1) {
            let formData = {
              username: '',
              email: '',
              password: '',
              passwordConf: ''
            };
            this.setState({message: response.message, errorMessage: '', flag: response.flag, loginFormData: formData});
            localStorage.setItem('token', response.token);
            window.location.href = config.frontendBaseUrl;
          } else {
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
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <form onSubmit={this.handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <div className="form-group">
                      <h5 className="text-danger">{this.state.errorMessage}</h5>
                    </div>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input name="username" type="text" onChange={this.handleInputChange}
                             value={this.state.signUpFormData.username}
                             id="name"
                             placeholder="UserName"/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input name="email" type="email" onChange={this.handleInputChange}
                             value={this.state.signUpFormData.email}
                             id="email"
                             placeholder="Email"/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input name="password" type="password" onChange={this.handleInputChange}
                             value={this.state.signUpFormData.password}
                             id="email"
                             placeholder="Password"/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input name="passwordConf" type="password" onChange={this.handleInputChange}
                             value={this.state.signUpFormData.passwordConf}
                             id="email"
                             placeholder="Password Confirmation"/>
                    </InputGroup>
                    <Button type="submit" color="success" block>Create Account</Button>
                  </form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="12">
                      <a href="#/login"  className="btn btn-primary btn-block"><span>Sign In</span></a>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    );
  }
}

export default SignUp;
