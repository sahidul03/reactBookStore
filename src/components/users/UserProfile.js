import React, {Component} from 'react';
import {getUser, uploadImage} from '../../lib/usersServices';
import config from '../../config';
import {
    NavLink
} from 'react-router-dom';

class UserProfile extends Component {
    state = {
        user: '',
        projects: [],
        ownProjects: [],
        file: '',
        imagePreviewUrl: ''
    };

    componentDidMount() {
        getUser(this.props.match.params.id).then(
            user => {
                this.setState({user: user, projects: user.projects, ownProjects: user.ownProjects});
            }
        )
    }

    handleImageUploadSubmit = (e) => {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        // console.log('this.state.file', this.state.file);

        uploadImage(this.state.file).then(response => {
            let tempUser = this.state.user;
            tempUser.photo = response.photo;
            this.setState({user: tempUser, imagePreviewUrl: '', file: ''});
            console.log('Response', response);
        })
    };

    handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    };


    render() {
        return (
            <div className="Home">
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        {this.state.user.photo? <img width="120" src={config.backendBaseUrl + this.state.user.photo}/> : ''}
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <form onSubmit={this.handleImageUploadSubmit}>
                            <input type="file" onChange={this.handleImageChange} />
                            {this.state.imagePreviewUrl ? <button type="submit" className="btn btn-primary" onClick={this.handleImageUploadSubmit}>Upload Image</button> : ''}

                        </form>
                        <img src={this.state.imagePreviewUrl} width="200" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <h4>
                            Projects created by {this.state.user.username}
                        </h4>
                        {this.state.ownProjects.map(project => <div key={project._id}><NavLink activeClassName="headerMenuActive"
                                                                                               to={"/projects/" + project._id}>{project.title}</NavLink>
                        </div>)}
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 text-right">
                        <h4>All projects</h4>
                        {this.state.projects.map(project => <div key={project._id}><NavLink activeClassName="headerMenuActive"
                                                                                            to={"/projects/" + project._id}>{project.title}</NavLink>
                        </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;
