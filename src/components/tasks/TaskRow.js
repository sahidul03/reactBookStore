import React, {Component} from 'react';
import Timestamp from 'react-timestamp';
import {
    NavLink
} from 'react-router-dom';

class TaskRow extends Component {
    render() {
        return (
            <tr key={this.props.task._id}>
              <td scope="row"><NavLink to={"/tasks/" + this.props.task._id}>{this.props.task.taskNumber}</NavLink></td>
              <td><NavLink to={"/tasks/" + this.props.task._id}> {this.props.task.title}</NavLink></td>
              <td>
                {this.props.task.assignee ? <NavLink to={"/users/" + this.props.task.assignee._id}>{this.props.task.assignee.username}</NavLink> : 'Not yet'}
              </td>
              <td><Timestamp time={this.props.task.updated_at} format='full' /></td>
              <td><NavLink to={"/users/" + this.props.task.creator._id}>{this.props.task.creator.username}</NavLink></td>
            </tr>
        );
    }
}

export default TaskRow;
