import React, {Component} from 'react';
import {createTask, getMinTask} from '../../lib/tasksServices';
import {getMinProject} from '../../lib/projectsServices';
import { toast } from 'react-toastify';
import config from '../../config';
import {
    NavLink
} from 'react-router-dom';

class NewTask extends Component {
    state = {
        project: {},
        parentTask: '',
        task: {
            title: '',
            description: '',
            project: ''
        },
        flag: null,
        submitted: false,
        message: '',
        errorMessage: ''
    };

    componentDidMount(){
        getMinProject(this.props.match.params.projectId).then(
            project => {
                var tempTask = this.state.task;
                tempTask.project = project._id;
                this.setState({project: project, task: tempTask});
            }
        );
        getMinTask(this.props.match.params.parentTaskId).then(
            pTask => {
                if(pTask){
                    var tempTask = this.state.task;
                    tempTask.parentTask = pTask._id;
                    this.setState({parentTask: pTask, task: tempTask});
                }
            }
        );
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.task) {
          this.setState({submitted: true});
            createTask(this.state.task).then(response => {
                    if(response._id){
                      toast.success("Task has been created successfully!");
                        // let formData = {
                        //     title: '',
                        //     description: ''
                        // };
                        // this.setState({message: response.message, errorMessage: '', flag: response.flag, task: formData});
                        this.props.history.push('/projects/' + this.state.project._id);
                    }else {
                        this.setState({submitted: false, message: '', errorMessage: response.message, flag: response.flag});
                    }
                }
            )
        }
    };

    handleInputChange = (evt) => {
        let formData = this.state.task;
        formData[evt.target.name] = evt.target.value;
        this.setState({
            task: formData
        });
    };

    render() {
        return (
            <div className="NewProject">
                <h4><strong>Create a new task</strong></h4>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group col-md-12 col-sm-12">
                                <h5 className="text-danger">{this.state.errorMessage}</h5>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label>Project: </label>
                                <NavLink to={"/projects/" + this.state.project._id }> { this.state.project.title}</NavLink>
                            </div>
                            {this.state.parentTask ? <div className="form-group col-md-12 col-sm-12">
                                <label>Parent Task: </label>
                                <NavLink to={"/tasks/" + this.state.parentTask._id }> { this.state.parentTask.title}</NavLink>
                            </div> : ''}

                            <div className="form-group col-md-12 col-sm-12">
                                <label>Task Title*</label>
                                <input name="title" type="text" onChange={this.handleInputChange}
                                       value={this.state.task.title}
                                       className="form-control input-sm" id="title"
                                       placeholder="Title" required/>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label>Task Description*</label>
                                <textarea name="description" onChange={this.handleInputChange}
                                          value={this.state.task.description}
                                          className="form-control input-sm" id="description"
                                          placeholder="Description" required></textarea>
                            </div>
                            <div className="col-md-12 col-sm-12">
                                <button type="submit" className={"btn btn-primary pull-right " + (this.state.submitted ? 'disabled' : '')} disabled={this.state.submitted}>Submit {this.state.submitted ? <span><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewTask;
