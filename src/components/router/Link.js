import React, {Component}  from 'react';

export class Link extends Component{
    handleClick = (evt) => {
        evt.preventDefault();
        //eslint-disable-next-line
        history.pushState(null, '', this.props.to)
    };
    render(){
        return <a href="#" onClick={this.handleClick}>{this.props.children}</a>
    }
}