import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import {loggingStatus, login} from '../../lib/authenticationService';
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
    submitted: false,
    flag: null,
    message: '',
    errorMessage: ''
  };

  componentWillMount() {
    loggingStatus().then(response => {
      if (response && response.flag === 1) {
        this.props.history.push('/');
      }
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('Authenticating....');
    this.setState({ submitted: true})
    if (this.state.loginFormData) {
      login(this.state.loginFormData).then(response => {
        if(response){
          if (response.flag === 1) {
            let formData = {
              username: '',
              password: ''
            };
            this.setState({message: response.message, submitted: false, errorMessage: '', flag: response.flag, loginFormData: formData});
            localStorage.setItem('token', response.token);
            this.props.history.push('/');
          } else {
            this.setState({message: '', submitted: false, errorMessage: response.message, flag: response.flag});
          }
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
                          <Button color="primary" className={"px-4 " + (this.state.submitted ? 'disabled' : '')} disabled={this.state.submitted}>Login</Button>
                          {this.state.submitted ? <span className="m-l-10 color-blue"><i className="fa fa-spinner fa-spin"></i></span> : ''}
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button type="button" color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{width: 44 + '%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        This is a Task management application. Here you can easily manage your projects.
                        Can create task, sub task, assign members to project and one member to each task.
                        You also can communicate(individual chat and group chat) with your projects members through this application.
                      </p>
                      <NavLink to={'/signup'} className="mt-3 btn btn-primary active">Register Now!</NavLink>
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
