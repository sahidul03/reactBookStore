import React, {Component} from 'react';
import {getCurrentUser} from '../../lib/usersServices';
import {
    NavLink
} from 'react-router-dom';

class Home extends Component {
    state = {
        user: '',
        projects: [],
        ownProjects: [],
        timestamp: null
    };

    componentDidMount() {
        getCurrentUser().then(
            user => {
              if(user){
                this.setState({user: user, projects: user.projects, ownProjects: user.ownProjects});
              }
            }
        )
    }

    render() {
      if(this.state.user){
        return (
            <div className="Home">
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <h4>All projects of mine</h4>
                        {this.state.projects.length == 0? <p><mark>Currently you have not any project and also you are not assigned to any project.</mark></p>:""}
                        {this.state.projects.map(project => <div key={project._id}><NavLink
                        to={"/projects/" + project._id}>
                        {project.title} {project.creator == this.state.user._id ? <span className="badge badge-info">Owner</span> : ''}
                         </NavLink>
                        </div>)}
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 text-right">
                        <h4>
                            <NavLink className="mt-3 btn btn-primary active" to="/project/new"> + Create a project</NavLink>
                        </h4>
                    </div>
                </div>
            </div>
        );}
        else{
          return <div className="whole-page-spiner color-blue"><i className="fa fa-spinner fa-pulse fa-fw"></i></div>
        }
    }
}

export default Home;
