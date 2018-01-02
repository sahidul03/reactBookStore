import React, {Component} from 'react';
import {getUser} from '../../lib/usersServices';
import {
    NavLink
} from 'react-router-dom';

class Home extends Component {
    state = {
        user: '',
        projects: [],
        ownProjects: []
    };

    componentDidMount() {
        getUser().then(
            user => {
                this.setState({user: user, projects: user.projects, ownProjects: user.ownProjects});
            }
        )
    }

    render() {
        return (
            <div className="Home">
                <h4>Username: {this.state.user.username}, Email: {this.state.user.email}</h4>
                <div className="row">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <h4>
                            Projects created by me
                            <NavLink className="cursor-pointer" to="/project/new"> +Create a project</NavLink>
                        </h4>
                        {this.state.ownProjects.map(project => <div key={project._id}><NavLink activeClassName="headerMenuActive"
                                                                             to={"/projects/" + project._id}>{project.title}</NavLink>
                        </div>)}
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 text-right">
                        <h4>All projects of mine</h4>
                        {this.state.projects.map(project => <div key={project._id}><NavLink activeClassName="headerMenuActive"
                                                                             to={"/projects/" + project._id}>{project.title}</NavLink>
                        </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
