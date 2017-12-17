import React, {Component} from 'react';
const getCurrentPath = () => {
    const path = document.location.pathname;
    return path.substring(path.lastIndexOf('/'));
};
export class Router extends Component {
    state = {
        route: getCurrentPath()
    };

    handleLinkClick = (route) => {
        this.setState({route});
        //eslint-disable-next-line
        history.pushState(null, '', route)
    };
    render(){
        return <div>{this.props.children}</div>
    }
}