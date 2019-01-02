import React, {Component} from 'react';
import {getUser, uploadImage, getCurrentUser} from '../../lib/usersServices';
import AppLoader from '../shared/AppLoader';
import config from '../../config';
import { toast } from 'react-toastify';
import './profile.css';
import {
    NavLink
} from 'react-router-dom';

class UserProfile extends Component {
    state = {
        user: '',
        currentUser: '',
        projects: [],
        ownProjects: [],
        file: '',
        imagePreviewUrl: '',
        uploading: false
    };

    componentDidMount() {
        if(this.props.match.params.id){
          getUser(this.props.match.params.id).then(
            user => {
                this.setState({user: user, projects: user.projects, ownProjects: user.ownProjects});
            }
          )
        }else{
          getCurrentUser().then(
            user => {
                this.setState({user: user, projects: user.projects, ownProjects: user.ownProjects});
            }
          )
        }

    }

    handleImageUploadSubmit = (e) => {
        e.preventDefault();

        this.setState({uploading: true});
        uploadImage(this.state.file).then(response => {
            toast.success("Profile picture updated successfully!")
            let tempUser = this.state.user;
            tempUser.photo = response.photo;
            this.setState({uploading: false, user: tempUser, imagePreviewUrl: '', file: ''});
            let tempCurrentUser = this.props.currentUser;
            tempCurrentUser.photo = response.photo;
            this.props.callbackOnCurrentUserChange(tempCurrentUser);
        })
    };

    cancelUploadImage = (e) => {
      this.setState({ imagePreviewUrl: '', file: ''});
    };

    capitalize = (str) => {
      return str? str.charAt(0).toUpperCase() + str.slice(1) : '';
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
      if(this.state.user)
        return (
            <div className="Home btm-profile-page">
            <div className="container emp-profile">
            <form method="post">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                            {this.state.imagePreviewUrl? <img src={this.state.imagePreviewUrl}/> : ''}
                            {(this.state.imagePreviewUrl == '' && this.state.user.photo)? <img src={config.backendBaseUrl + this.state.user.photo}/> : ''}
                            {(this.props.currentUser && this.state.user && this.props.currentUser._id == this.state.user._id)? <div className="file btn btn-lg btn-primary">
                                Change Photo
                                <input type="file" onChange={this.handleImageChange}/>
                            </div> : ""}

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
                                    <h5>{this.capitalize(this.state.user.username)}</h5>
                                    <h6>
                                        Software Developer and Designer
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
                            <a href="">Software Developer</a><br/>
                            <a href="">HTML5, CSS3, Bootstrap</a><br/>
                            <a href="">JavaScript</a><br/>
                            <a href="">Angular, ReactJS, VueJS</a><br/>
                            <a href="">Ruby, Python, .Net, PHP</a><br/>
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
                                                <p>{this.state.user.username}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Name</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.capitalize(this.state.user.username)}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.user.email}</p>
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
                                                <p>Software Developer and Designer</p>
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
                                                <p>15$/hr</p>
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

            </div>
        );
      else
        return <AppLoader currentUser={this.props.currentUser}/>
    }
}

export default UserProfile;
