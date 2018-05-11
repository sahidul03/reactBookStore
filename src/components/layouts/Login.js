import React, {Component} from 'react';
import {login} from '../../lib/authenticationService';
import {getRequest} from '../../lib/common/commonApiGetway';
import config from '../../config';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';


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

  componentWillMount() {
    getRequest('/profile').then(response => {
      if (response) {
        window.location.href = config.frontendBaseUrl;
      }
    })
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('Authenticating....');
    if (this.state.loginFormData) {
      login(this.state.loginFormData).then(response => {
          if (response.flag === 1) {
            let formData = {
              username: '',
              password: ''
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
    let formData = this.state.loginFormData;
    formData[evt.target.name] = evt.target.value;
    this.setState({
      loginFormData: formData
    });
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <h5 className="text-danger">{this.state.errorMessage}</h5>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input name="username" onChange={this.handleInputChange}
                               type="text" id="inputEmail"
                               value={this.state.loginFormData.username}
                               placeholder="Email Address"/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input name="password" onChange={this.handleInputChange}
                               type="password" id="inputPassword"
                               value={this.state.loginFormData.password}
                               placeholder="Password"/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button type="submit" color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{width: 44 + '%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      {/*<Button color="primary" className="mt-3" active>Register Now!</Button>*/}
                      <a href="#/signup" className="mt-3 btn btn-primary active">Register Now!</a>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
