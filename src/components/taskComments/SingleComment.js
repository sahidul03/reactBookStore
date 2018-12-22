import React, {Component} from 'react';
import Timestamp from 'react-timestamp';
import {
    NavLink
} from 'react-router-dom';
import config from '../../config';

class SingleComment extends Component {
    createMarkup = (text) => {
      return {__html: text};
    }

    render() {
        return (
            <div key={this.props.comment._id} className="comment">
                <div className="comment-header">
                    <img src={config.backendBaseUrl + this.props.comment.commenter.photo} className="profile-image" alt={this.props.comment._id}/>
                    <NavLink className="profile-name"
                             to={"/users/" + this.props.comment.commenter._id}>{this.props.comment.commenter.username}</NavLink>
                    <span className="created-date"><Timestamp time={this.props.comment.updated_at} format='full' includeDay /></span>
                </div>
                <div className="comment-body" dangerouslySetInnerHTML={this.createMarkup(this.props.comment.description)}></div>
            </div>
        );
    }
}

export default SingleComment;
