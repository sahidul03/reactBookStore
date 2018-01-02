import React, {Component} from 'react';
import {getProject} from '../../lib/projectsServices';
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
        userFetched: false
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
                    this.setState({availableUsers: users, userFetched: true});
                }
            );
        }
        this.setState({showAddMembersForm: !tempFlag});

    };

    render() {
        return (
            <div className="ProjectDetails">
                <h4><strong>Title: </strong>{this.state.project.title}</h4>
                <p><strong>Description: </strong>{this.state.project.description}</p>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <NavLink className="cursor-pointer"
                                 to={"/" + this.state.project._id + "/tasks/new/00000000000"}> +Create a task</NavLink>
                        <h4>Tasks list</h4>
                        {this.state.tasks.map(task => <h5 key={task._id}>{task.title}</h5>)}
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <h4>Creator: {this.state.project.creator ? this.state.project.creator.username : ''}</h4><br/>
                        <h4>Members
                            <button className="btn btn-default pull-right" onClick={this.handleAddMembersForm}>+ Add Members</button>
                        </h4>
                        {this.state.showAddMembersForm ? <div className="AddMemberFrom">
                            <select className="form-control">
                                {this.state.availableUsers.map(user => <option value={user._id} className="form-control">{user.username}</option>)}
                            </select>
                            <button className="pull-right btn btn-info">Add</button>
                        </div> : ""}
                        <div>
                            {this.state.members.map(member => <h5 key={member._id}>{member.username}</h5>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectDetails;
