import React, {Component} from 'react';
import {getTask, addAssigneeToTask, changeTaskStatus} from '../../lib/tasksServices';
import {createComment} from '../../lib/commentsServices';
import {getAllUsers} from '../../lib/usersServices';
import Timestamp from 'react-timestamp';
import TaskList from './TaskList';
import TaskCommentList from '../taskComments/TaskCommentList'
import { toast } from 'react-toastify';
import AppLoader from '../shared/AppLoader';
import {
    NavLink
} from 'react-router-dom';
import { appendComment, addComment , joinToTaskRoom} from '../../lib/socket/sampleService';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";

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
        assignee_id: '',
        showAddCommentForm: false,
        newCommentDescription: '',
        submittingAssigneeForm: false,
        submittingStatusChangingForm: false
    };

    updateContent = (value) => {
        this.setState({newCommentDescription:value})
    }
    /**
     * @property Jodit jodit instance of native Jodit
     */
    jodit;
    setRef = jodit => this.jodit = jodit;

    config = {
        readonly: false // all options from https://xdsoft.net/jodit/doc/
    }

    createMarkup = (text) => {
      return {__html: text};
    }

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
            toast.info( comment.commenter.username + " added a comment in this task.");
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
                    comments: task.comments,
                    availableUsers: task.project.members
                });
                if (this.state.assignee) {
                  var tempUsers = this.state.availableUsers;
                  var u = tempUsers.find(user => {
                      return user._id === this.state.assignee._id
                  });
                  var index = tempUsers.indexOf(u);
                  if (index > -1) {
                    tempUsers.splice(index, 1);
                  }
                  this.setState({ availableUsers: tempUsers });
                }
            }
        )
    }

    handleAddAssigneeForm = () => {
        var tempFlag = this.state.showAddAssigneeForm;
        this.setState({showAddAssigneeForm: !tempFlag});
    };

    changeTaskStatus = (status) => {
        this.setState({submittingStatusChangingForm: true});
        var data = {task_id: this.state.task._id, status: status};
        changeTaskStatus(data).then(
            user => {
                var toastMsg = "Status of task changed to " + status;
                toast.info(toastMsg);
                var tempTask = this.state.task;
                tempTask.status = status;
                this.setState({task: tempTask, submittingStatusChangingForm: false});
            }
        );
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
                this.setState({submittingAssigneeForm: true})
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
                        if(this.state.assignee){
                          toast("Assignee changed successfully!");
                        }else{
                          toast("Assignee assigned successfully!");
                        }
                        this.setState({availableUsers: availableUsers, assignee_id: '', assignee: user, submittingAssigneeForm: false, showAddAssigneeForm: false});
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
      if(this.state.task)
        return (
            <div className="TaskDetails">
                <div className="row">
                    <div className="col-sm-8 col-md-8 col-lg-8">
                        {this.state.parentTask ? <h5><strong>Parent task: </strong><NavLink
                            to={"/tasks/" + this.state.parentTask._id}>{this.state.parentTask.title}</NavLink>
                        </h5> : ''}
                        <h4 className="color-cadetblue">{this.state.task.title}</h4>
                        <label>Description: </label>
                        <div className="taskDescription" dangerouslySetInnerHTML={this.createMarkup(this.state.task.description)}></div>
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
                            <select className="form-control m-b-10 m-t-10" onChange={this.handleInputChange} name="member_id"
                                    value={this.state.assignee_id}>
                                <option key={0} value=''>Please select one user</option>
                                {this.state.availableUsers.map(user => <option key={user._id} value={user._id}
                                                                               className="form-control">{user.username}</option>)}
                            </select>
                            <button className={"btn btn-info pull-right " + (this.state.submittingAssigneeForm ? 'disabled' : '')} disabled={this.state.submittingAssigneeForm} onClick={this.addAssigneeToThisTask}>Add
                                assignee {this.state.submittingAssigneeForm ? <span><i className="fa fa-spinner fa-pulse fa-fw color-white"></i></span> : ''}
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
                            <div>
                                <strong>Type: </strong>
                                {this.state.task.type === 'Bug' ?
                                    <span className="badge badge-danger"> <i className="fa fa-bug"></i> {this.state.task.type}</span>
                                    : ""}
                                {this.state.task.type === 'Task' ?
                                    <span className="badge badge-success"> <i className="fa fa-tasks"></i> {this.state.task.type}</span>
                                    : ""}
                                {this.state.task.type === 'Story' ?
                                    <span className="badge badge-primary"> <i className="fa fa-tasks"></i> {this.state.task.type}</span>
                                    : ""}
                                {this.state.task.type === 'Change Request' ?
                                    <span className="badge badge-warning"> <i className="fa fa-tasks"></i> {this.state.task.type}</span>
                                    : ""}
                            </div>
                            <div>
                                <strong>Status: </strong>
                                {this.state.task.status === 'Open' ?
                                    <span>
                                      <span className="badge badge-primary"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('In Progress')}>
                                        Start Progress {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                                {this.state.task.status === 'In Progress'?
                                    <span>
                                      <span className="badge badge-warning"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('In Review')}>
                                        Review Request {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                                {this.state.task.status === 'In Review'?
                                    <span>
                                      <span className="badge badge-warning"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('Resolved')}>
                                      Resolve {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                                {this.state.task.status === 'Reopen'?
                                    <span>
                                      <span className="badge badge-warning"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('In Progress')}>
                                      Start Progress {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                                {this.state.task.status === 'Resolved' ?
                                    <span>
                                      <span className="badge badge-success"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('Closed')}>
                                      Close {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                                {this.state.task.status === 'Closed' ?
                                    <span>
                                      <span className="badge badge-success"> {this.state.task.status}</span>
                                      <button className={"btn btn-outline-primary btn-sm m-l-20 min-width-120 " + (this.state.submittingStatusChangingForm ? 'disabled' : '')} disabled={this.state.submittingStatusChangingForm} onClick={() => this.changeTaskStatus('Reopen')}>
                                      Open Again {this.state.submittingStatusChangingForm ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                                      </button>
                                    </span>
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                        <h4>
                            <button onClick={this.handleAddCommentForm} className="btn btn-sm btn-default">
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
                                    <JoditEditor
                                        editorRef={this.setRef}
                                        value={this.state.newCommentDescription}
                                        config={this.config}
                                        onChange={this.updateContent}
                                        placeholder="Write Comments here ..." required/>
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
      else
        return <AppLoader currentUser={this.props.currentUser}/>
    }
}

export default TaskDetails;
