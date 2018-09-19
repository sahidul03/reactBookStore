import React, {Component} from 'react';
import Timestamp from 'react-timestamp';
import {getProject, addMemberToProject, removeMemberFromProject} from '../../lib/projectsServices';
import {getAllUsers} from '../../lib/usersServices';
import {
    NavLink
} from 'react-router-dom';


class ProjectDetails extends Component {
    state = {
        availableUsers: [],
        project: '',
        members: [],
        tasks: [],
        showAddMembersForm: false,
        userFetched: false,
        member_id: ''
    };

    componentDidMount() {
        getProject(this.props.match.params.id).then(
            project => {
                this.setState({project: project, members: project.members, tasks: project.tasks});
            }
        )
    }

    handleAddMembersForm = () => {
        var tempFlag = this.state.showAddMembersForm;
        if(!this.state.userFetched){
            getAllUsers().then(
                users => {
                    this.state.members.map((member)=>{
                        var u = users.find( user =>{return user._id === member._id});
                        var index = users.indexOf(u);
                        if (index > -1) {
                            users.splice(index, 1);
                        }
                    });
                    this.setState({availableUsers: users, userFetched: true});
                }
            );
        }
        this.setState({showAddMembersForm: !tempFlag});
    };

    addMemberToThisProject = () => {
        if(this.state.member_id){
            var obj = this.state.members.find((obj)=> { return obj._id === this.state.member_id });
            if(obj){
                console.log('Already added this member.');
            }else {
                addMemberToProject({project_id: this.state.project._id, member_id: this.state.member_id}).then(
                    user => {
                        var members = this.state.members;
                        members.push(user);
                        var abUser = this.state.availableUsers.find((obj)=> {return obj._id === this.state.member_id});
                        var tempAvailableUser = this.state.availableUsers;
                        var index = tempAvailableUser.indexOf(abUser);
                        if (index > -1) {
                            tempAvailableUser.splice(index, 1);
                            this.setState({availableUsers: tempAvailableUser});
                        }
                        this.setState({members: members, member_id: ''});
                    }
                );
            }
        }
    };

    removeMemberFromThisProject = (member_id) => {
        console.log('member_id: ', member_id);
        if(member_id){
            var removedMember = this.state.members.find((obj)=> { return obj._id === member_id });
            if(removedMember){
                removeMemberFromProject({project_id: this.state.project._id, member_id: member_id}).then(
                    user => {
                        var members = this.state.members;
                        var index = members.indexOf(removedMember);
                        if (index > -1) {
                            members.splice(index, 1);
                            this.setState({members: members});
                        }
                        var tempAvailableUser = this.state.availableUsers;
                        tempAvailableUser.push(removedMember);
                        this.setState({availableUsers: tempAvailableUser});
                    }
                );
            }else {
                console.log('He is not member of this project at all.');
            }
        }
    };

    handleInputChange = (evt) => {
        this.setState({member_id: evt.target.value});
    };

    render() {
        return (
            <div className="ProjectDetails">
                <h4><strong>Title: </strong>{this.state.project.title}</h4>
                <p><strong>Short Name: {this.state.project.shortName}</strong></p>
                <p><strong>Description: </strong>{this.state.project.description}</p>
                <div className="row">
                    <div className="col-sm-8 col-md-8 col-lg-8">
                    <div className="m-b-10">
                        <NavLink className="cursor-pointer"
                                 to={"/" + this.state.project._id + "/tasks/new/00000000000"}> + Create a task</NavLink>
                    </div>
                        
                        {this.state.tasks.length > 0 ? <div><h4>Tasks list</h4>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">Task Number</th>
                              <th scope="col">Title</th>
                              <th scope="col">Assignee</th>
                              <th scope="col">Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                          {this.state.tasks.map(task =>
                        <tr key={task._id}>
                              <td scope="row"><NavLink to={"/tasks/" + task._id}>{task.taskNumber}</NavLink></td>
                              <td><NavLink to={"/tasks/" + task._id}> {task.title}</NavLink></td>
                              <td><NavLink to={"/users/" + task.creator._id}>{task.creator.username}</NavLink></td>
                              <td><Timestamp time={task.updated_at} format='full' /></td>
                            </tr>
                            )}                            
                          </tbody>
                        </table></div> : ''}
                    </div>
                    <div className="col-sm-4 col-md-4 col-lg-4 border-left-2-grey">
                        <h4>Creator: {this.state.project.creator ? <NavLink to={"/users/" + this.state.project.creator._id}>{this.state.project.creator.username}</NavLink>: ''}</h4><br/>
                        <h4>
                            <button className="btn btn-default pull-right" onClick={this.handleAddMembersForm}>+ Add Members</button>
                        </h4><br/>
                        {this.state.showAddMembersForm ? <div className="AddMemberFrom">
                            <select className="form-control m-b-10 m-t-10"  onChange={this.handleInputChange} name="member_id" value={this.state.member_id}>
                                <option key={0} value=''>Please select one user</option>
                                {this.state.availableUsers.map(user => <option key={user._id} value={user._id} className="form-control">{user.username}</option>)}
                            </select>
                            <button className="pull-right btn btn-info" onClick={this.addMemberToThisProject}>Add</button><br/><br/>
                        </div> : ""}
                        <div>
                            <strong>Members: </strong>
                            {this.state.members.map(member => <div key={member._id}>
                                <NavLink to={"/users/" + member._id}>{member.username}</NavLink>
                                <span onClick={() => this.removeMemberFromThisProject(member._id)} className="badge badge-danger cursor-pointer remove-icon-project-members">x</span>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectDetails;
