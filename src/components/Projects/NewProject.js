import React, {Component} from 'react';
import {createProject} from '../../lib/projectsServices';
import config from '../../config';
import { toast } from 'react-toastify';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";


class NewProject extends Component {
    state = {
        project: {
            title: '',
            shortName: '',
            description: ''
        },
        flag: null,
        message: '',
        submitted: false,
        errorMessage: ''
    };

    /**
     * @property Jodit jodit instance of native Jodit
     */
    jodit;
    setRef = jodit => this.jodit = jodit;

    config = {
        readonly: false // all options from https://xdsoft.net/jodit/doc/
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.project) {
          this.setState({submitted: true});
            createProject(this.state.project).then(response => {
                    if(response._id){
                        toast.success("Project has been created successfully!");
                        // let formData = {
                        //     title: '',
                        //     description: ''
                        // };
                        // this.setState({message: response.message, errorMessage: '', flag: response.flag, project: formData});
                        this.props.history.push('/');
                    }else {
                        this.setState({message: '', errorMessage: response.message, flag: response.flag, submitted: false});
                    }
                }
            )
        }
    };

    handleInputChange = (evt) => {
        let formData = this.state.project;
        formData[evt.target.name] = evt.target.value;
        this.setState({ project: formData });
    };

    handleDescriptionChange = (value) => {
      let formData = this.state.project;
        formData['description'] = value;
        this.setState({ project: formData });
    }

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
                                <label>Short Name*</label>
                                <input name="shortName" type="text" onChange={this.handleInputChange}
                                       value={this.state.project.shortName}
                                       className="form-control input-sm" id="title"
                                       placeholder="Short Name" required/>
                            </div>
                            <div className="form-group col-md-12 col-sm-12">
                                <label>Description*</label>
                                <JoditEditor
                                        editorRef={this.setRef}
                                        value={this.state.project.description}
                                        config={this.config}
                                        onChange={this.handleDescriptionChange}
                                        placeholder="Write Description here ..." required/>
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

export default NewProject;
