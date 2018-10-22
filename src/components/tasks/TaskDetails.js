import React, {Component} from 'react';
import {getTask, addAssigneeToTask} from '../../lib/tasksServices';
import {createComment} from '../../lib/commentsServices';
import {getAllUsers} from '../../lib/usersServices';
import Timestamp from 'react-timestamp';
import TaskList from './TaskList';
import TaskCommentList from '../taskComments/TaskCommentList'
import {
    NavLink
} from 'react-router-dom';
import { appendComment, addComment , joinToTaskRoom} from '../../lib/socket/sampleService';

class TaskDetails extends Component {
    state = {
        availableUsers: [],
        task: '',
        project: '',
        assignee: '',
        creator: '',
        parentTask: '',
        subTasks: [],
        comments: [],
        showAddAssigneeForm: false,
        userFetched: false,
        assignee_id: '',
        showAddCommentForm: false,
        newCommentDescription: ''
    };

    componentWillReceiveProps(newProps) {
        joinToTaskRoom(newProps.match.params.id);
        getTask(newProps.match.params.id).then(
            task => {
                this.setState({
                    task: task,
                    project: task.project,
                    subTasks: task.subTasks,
                    assignee: task.assignee,
                    creator: task.creator,
                    parentTask: task.parentTask,
                    comments: task.comments
                });
            }
        )
    }

    componentDidMount() {
        joinToTaskRoom(this.props.match.params.id);
        appendComment((comment) => {
            var tempComments = this.state.comments;
            tempComments.push(comment);
            this.setState({comments: tempComments});
            }
        );
        getTask(this.props.match.params.id).then(
            task => {
                this.setState({
                    task: task,
                    project: task.project,
                    subTasks: task.subTasks,
                    assignee: task.assignee,
                    creator: task.creator,
                    parentTask: task.parentTask,
                    comments: task.comments
                });
            }
        )
    }

    handleAddAssigneeForm = () => {
        var tempFlag = this.state.showAddAssigneeForm;
        if (!this.state.userFetched) {
            getAllUsers().then(
                users => {
                    if (this.state.assignee) {
                        var u = users.find(user => {
                            return user._id === this.state.assignee._id
                        });
                        var index = users.indexOf(u);
                        if (index > -1) {
                            users.splice(index, 1);
                        }
                    }
                    this.setState({availableUsers: users, userFetched: true});
                }
            );
        }
        this.setState({showAddAssigneeForm: !tempFlag});
    };

    handleAddCommentForm = () => {
        this.setState({showAddCommentForm: !this.state.showAddCommentForm});
    };

    addAssigneeToThisTask = () => {
        if (this.state.assignee_id) {
            if (this.state.assignee && (this.state.assignee_id === this.state.assignee._id)) {
                console.log('Already assigned this user.');
            } else {
                var data = {task_id: this.state.task._id, assignee_id: this.state.assignee_id};
                addAssigneeToTask(data).then(
                    user => {
                        var availableUsers = this.state.availableUsers;
                        if (this.state.assignee) {
                            availableUsers.push(this.state.assignee);
                        }
                        var abUser = this.state.availableUsers.find((obj) => {
                            return obj._id === this.state.assignee_id
                        });
                        var index = availableUsers.indexOf(abUser);
                        if (index > -1) {
                            availableUsers.splice(index, 1);
                        }
                        this.setState({availableUsers: availableUsers, assignee_id: '', assignee: user});
                    }
                );
            }
        }
    };

    handleInputChange = (evt) => {
        this.setState({assignee_id: evt.target.value});
    };

    handleCommentInputChange = (evt) => {
        this.setState({
            newCommentDescription: evt.target.value
        });
    };

    handleAddCommentFormSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.newCommentDescription) {
            var data = {
              task: this.state.task._id,
              description: this.state.newCommentDescription
            };
            createComment(data).then(comment => {
                    if(comment){
                        addComment(comment);
                        // var tempComments = this.state.comments;
                        // tempComments.push(comment);
                        this.setState({newCommentDescription: "", showAddCommentForm: false});
                    }
                }
            )
        }
    };

    render() {
        return (
            <div className="TaskDetails">
                <div className="row">
                    <div className="col-sm-8 col-md-8 col-lg-8">
                        {this.state.parentTask ? <h5><strong>Parent task: </strong><NavLink
                            to={"/tasks/" + this.state.parentTask._id}>{this.state.parentTask.title}</NavLink>
                        </h5> : ''}
                        <h4 className="color-cadetblue">{this.state.task.title}</h4>
                        <p><strong>Description: </strong>{this.state.task.description}</p>
                        <NavLink className="cursor-pointer"
                                 to={"/" + this.state.project._id + "/tasks/new/" + this.state.task._id}> + Create a sub
                            task</NavLink>
                        {this.state.subTasks.length > 0 ? <TaskList tasks={this.state.subTasks} title={"List of sub tasks"}/> : ''}

                    </div>
                    <div className="col-sm-4 col-md-4 col-lg-4 border-left-2-grey">
                        <h5>
                            <strong>Creator:</strong> {this.state.task.creator ? <NavLink
                            to={"/users/" + this.state.task.creator._id}>{this.state.task.creator.username}</NavLink> : ''}
                        </h5>
                        <h5>
                            <strong>Project:</strong> {this.state.project ? <NavLink
                            to={"/projects/" + this.state.project._id}>{this.state.project.title}</NavLink> : ''}
                        </h5>
                        <h5>
                            <button className="btn btn-default btn-sm" onClick={this.handleAddAssigneeForm}>+ Add or
                                Change Assignee
                            </button>
                        </h5>
                        {this.state.showAddAssigneeForm ? <h5 className="AddMemberFrom">
                            <select className="form-control" onChange={this.handleInputChange} name="member_id"
                                    value={this.state.assignee_id}>
                                <option key={0} value=''>Please select one user</option>
                                {this.state.availableUsers.map(user => <option key={user._id} value={user._id}
                                                                               className="form-control">{user.username}</option>)}
                            </select>
                            <button className="pull-right btn btn-info" onClick={this.addAssigneeToThisTask}>Add
                                assignee
                            </button>
                            <br/><br/>
                        </h5> : ""}
                        <div>
                            <div>
                                <strong>Assignee: </strong>
                                {this.state.assignee ?
                                    <NavLink
                                        to={"/users/" + this.state.assignee._id}>{this.state.assignee.username}</NavLink>
                                    : "Not assigned yet"}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                        <h4>
                            <button onClick={this.handleAddCommentForm} className="btn btn-sm btn-default pull-right">
                                + Add comment
                            </button>
                        </h4>
                        {this.state.showAddCommentForm ? <div ref="CommentForm" className="addComment">
                            <form onSubmit={this.handleAddCommentFormSubmit}>
                                <div className="form-group col-md-12 col-sm-12">
                                    <h5 className="text-danger">{this.state.errorMessage}</h5>
                                </div>
                                <div className="form-group col-md-12 col-sm-12">
                                    <label>Add Comments*</label>
                                    <textarea name="description" onChange={this.handleCommentInputChange}
                                              value={this.state.newCommentDescription}
                                              className="form-control input-sm" id="description"
                                              placeholder="Write Comments here ..." required></textarea>
                                </div>
                                <div className="col-md-12 col-sm-12 text-right">
                                    <input type="submit" className="btn btn-primary" value="Add"/>
                                </div>
                            </form>
                        </div> : ''}
                        {this.state.comments.length > 0 ? <TaskCommentList comments={this.state.comments}/>  : ''}
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskDetails;
