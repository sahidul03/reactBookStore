import React, { Component } from 'react';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import {logout} from '../../lib/authenticationService';
import {getCurrentUserBasicInfo} from '../../lib/usersServices';
import config from '../../config';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class FullHeader extends Component {
  state = {
    basicUserInfo: ''
  };
  logoutSubmit() {
    logout().then(response => {
      if (response.flag === 1) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentChannelOrContact');
        localStorage.removeItem('currentConversationBox');
        window.location.href = config.frontendBaseUrl + '#/login';
      }
    })
  };

  componentDidMount() {
    getCurrentUserBasicInfo().then(
      user => {
        this.setState({basicUserInfo: user});
      }
    )
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: process.env.PUBLIC_URL + 'assets/img/brand/btm-logo.png', width: 89, height: 25, alt: 'BTM Logo' }}
          minimized={{ src: process.env.PUBLIC_URL + 'assets/img/brand/btm-logo.png', width: 30, height: 30, alt: 'BTM Logo' }}
        />
        {/*<AppSidebarToggler className="d-md-down-none" display="lg" />config.backendBaseUrl + this.state.basicUserInfo.photo*/}

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="#/">Home</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/conversation">Conversation</NavLink>
          </NavItem>
          <NavItem className="px-3">
            {this.state.basicUserInfo ? <NavLink href={'#/users/' + this.state.basicUserInfo._id}>Settings</NavLink> : ''}

          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none header-json">
            {this.state.basicUserInfo ? '{ username: ' + this.state.basicUserInfo.username + ', email: ' + this.state.basicUserInfo.email + ' }' : ''}
          </NavItem>
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-list"></i></NavLink>*/}
          {/*</NavItem>*/}
          {/*<NavItem className="d-md-down-none">*/}
            {/*<NavLink href="#"><i className="icon-location-pin"></i></NavLink>*/}
          {/*</NavItem>*/}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <i className="icon-bell"></i><Badge pill color="danger">5</Badge>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Notifications</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              {/*<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>*/}
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
          <AppHeaderDropdown direction="down">
            { this.state.basicUserInfo ?
              <DropdownToggle nav>
              <img src={config.backendBaseUrl + this.state.basicUserInfo.photo} className="img-avatar" alt="admin@bootstrapmaster.com" />
              </DropdownToggle> : ''
            }
            { this.state.basicUserInfo ?
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center">
                <strong>{this.state.basicUserInfo.username}</strong>
                  <br/>
                  {this.state.basicUserInfo.email}

              </DropdownItem>
              {/*<DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>*/}
              {/*<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>*/}
              <DropdownItem href={'#/users/' + this.state.basicUserInfo._id}>
                <i className="fa fa-user"></i> Profile
              </DropdownItem>
              <DropdownItem href={'#/users/' + this.state.basicUserInfo._id}>
                <i className="fa fa-wrench"></i> Settings
              </DropdownItem>
              {/*<DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>*/}
              {/*<DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>*/}
              {/*<DropdownItem divider />*/}
              {/*<DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>*/}
              <DropdownItem onClick={ this.logoutSubmit}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu> : ''}
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

FullHeader.propTypes = propTypes;
FullHeader.defaultProps = defaultProps;

export default FullHeader;
