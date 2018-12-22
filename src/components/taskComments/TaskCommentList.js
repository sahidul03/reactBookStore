import React, {Component} from 'react';
import Timestamp from 'react-timestamp';
import {
    NavLink
} from 'react-router-dom';
import config from '../../config';
import SingleComment from './SingleComment';

class TaskCommentList extends Component {
    render() {
        return (
            <div className="comments-container">
                <h4>Comments:</h4>
                {this.props.comments.map(comment => <SingleComment key={comment._id} comment={comment}/>)}
            </div>
        );
    }
}

export default TaskCommentList;
