import React, {Component} from 'react';
import {createProject} from '../../lib/projectsServices';


class NewProject extends Component {
    state = {
        project: {
            title: '',
            description: ''
        },
        flag: null,
        message: '',
        errorMessage: ''
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.project) {
            createProject(this.state.project).then(response => {
                    if(response._id){
                        let formData = {
                            title: '',
                            description: ''
                        };
                        this.setState({message: response.message, errorMessage: '', flag: response.flag, project: formData});
                        window.location.href = 'http://localhost:3000';
                    }else {
                        this.setState({message: '', errorMessage: response.message, flag: response.flag});
                    }
                }
            )
        }
    };

    handleInputChange = (evt) => {
        let formData = this.state.project;
        formData[evt.target.name] = evt.target.value;
        this.setState({
            project: formData
        });
    };

    render() {
        return (
            <div className="NewProject">
                <h4><strong>Create a new project</strong></h4>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group col-md-12 col-sm-12">
                                <h5 className="text-danger">{this.state.errorMessage}</h5>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label>Title*</label>
                                <input name="title" type="text" onChange={this.handleInputChange}
                                       value={this.state.project.title}
                                       className="form-control input-sm" id="title"
                                       placeholder="Title" required/>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label>Description*</label>
                                <textarea name="description" onChange={this.handleInputChange}
                                          value={this.state.project.description}
                                          className="form-control input-sm" id="description"
                                          placeholder="Description" required></textarea>
                            </div>
                            <div className="col-md-12 col-sm-12">
                                <input type="submit" className="btn btn-primary pull-right" value="Submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewProject;
