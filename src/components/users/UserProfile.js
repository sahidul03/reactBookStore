import React, {Component} from 'react';
import {getUser, uploadImage} from '../../lib/usersServices';
import config from '../../config';
import './profile.css';
import {
    NavLink
} from 'react-router-dom';

class UserProfile extends Component {
    state = {
        user: '',
        projects: [],
        ownProjects: [],
        file: '',
        imagePreviewUrl: '',
        uploading: false
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

        this.setState({uploading: true});
        uploadImage(this.state.file).then(response => {
            let tempUser = this.state.user;
            tempUser.photo = response.photo;
            this.setState({uploading: false, user: tempUser, imagePreviewUrl: '', file: ''});
            document.getElementById('profile-right-side-avatar').src = config.backendBaseUrl + this.state.user.photo;
        })
    };

    cancelUploadImage = (e) => {
      this.setState({ imagePreviewUrl: '', file: ''});
    };

    handleImageChange = (e) => {
      e.preventDefault();

      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        let tempUser = this.state.user;
        // tempUser.photo = reader.result;
          this.setState({
              file: file,
              imagePreviewUrl: reader.result,
              user: tempUser
          });
      };

      reader.readAsDataURL(file)
  };


    render() {
        return (
            <div className="Home btm-profile-page">
            <div className="container emp-profile">
            <form method="post">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                            {this.state.imagePreviewUrl? <img src={this.state.imagePreviewUrl}/> : ''}
                            {(this.state.imagePreviewUrl == '' && this.state.user.photo)? <img src={config.backendBaseUrl + this.state.user.photo}/> : ''}
                            <div className="file btn btn-lg btn-primary">
                                Change Photo
                                <input type="file" onChange={this.handleImageChange}/>
                            </div>
                            {this.state.imagePreviewUrl ? <div role="group" className="btn-group  m-t-m15">
                              <button className={"btn btn-primary " + (this.state.uploading ? 'disabled' : '')} disabled={this.state.uploading} onClick={this.handleImageUploadSubmit}>
                              Save
                              {this.state.uploading ? <span className="m-l-10"><i className="fa fa-spinner fa-pulse fa-fw"></i></span> : ''}
                              </button>
                              <button className={"btn btn-primary " + (this.state.uploading ? 'disabled' : '')} disabled={this.state.uploading} onClick={this.cancelUploadImage}>Cancel</button>
                            </div> : ''}


                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="profile-head">
                                    <h5>
                                        Kshiti Ghelani
                                    </h5>
                                    <h6>
                                        Web Developer and Designer
                                    </h6>
                                    <p className="proile-rating">RANKINGS : <span>8/10</span></p>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false">Timeline</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-2">
                        {/* <input type="submit" className="profile-edit-btn" name="btnAddMore" value="Edit Profile"/> */}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-work">
                            <p>WORK LINK</p>
                            <a href="">Website Link</a><br/>
                            <a href="">Bootsnipp Profile</a><br/>
                            <a href="">Bootply Profile</a>
                            <p>SKILLS</p>
                            <a href="">Web Designer</a><br/>
                            <a href="">Web Developer</a><br/>
                            <a href="">WordPress</a><br/>
                            <a href="">WooCommerce</a><br/>
                            <a href="">PHP, .Net</a><br/>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="tab-content profile-tab" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>User Id</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Kshiti123</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Name</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Kshiti Ghelani</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>kshitighelani@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Phone</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>123 456 7890</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Profession</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Web Developer and Designer</p>
                                            </div>
                                        </div>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Experience</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Hourly Rate</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>10$/hr</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Total Projects</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>English Level</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Availability</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>6 months</p>
                                            </div>
                                        </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Your Bio</label><br/>
                                        <p>Your detail description</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
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
