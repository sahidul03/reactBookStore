import React, {Component} from 'react';
import {getTask, addAssigneeToTask} from '../../lib/tasksServices';
import {createComment} from '../../lib/commentsServices';
import {getCurrentUser} from '../../lib/usersServices';
import Timestamp from 'react-timestamp';
import {
    NavLink
} from 'react-router-dom';
import {appendComment, addComment, joinToTaskRoom} from '../../lib/socket/sampleService';

class Conversation extends Component {
    state = {
        user: '',
        projects: [],
        contacts: [],
        ownProjects: [],
        message: '',
        currentChannelOrContact: null,
        currentConversationBox: ''
    };

    componentDidMount() {
        getCurrentUser().then(
            user => {
                console.log(user);
                this.setState({
                    user: user,
                    projects: user.projects,
                    ownProjects: user.ownProjects,
                    contacts: user.contacts
                });
                if(this.state.projects.length > 0){
                    this.setState({currentChannelOrContact: this.state.projects[0], currentConversationBox: 'project'})
                }else if(this.state.projects.length <= 0 && this.state.projects.length > 0){
                    this.setState({currentChannelOrContact: this.state.contacts[0], currentConversationBox: 'contact'})
                }
            }
        )
    }

    handleMessageSubmit = (evt) => {
        evt.preventDefault();
        console.log('Message form.');
    };

    handleMessageInputChange = (evt) => {
        this.setState({
            message: evt.target.value
        });
    };

    changeCurrentContact = (contact) => {
        this.setState({currentChannelOrContact: contact, currentConversationBox: 'contact'})
    };
    changeCurrentChannel = (channel) => {
        this.setState({currentChannelOrContact: channel, currentConversationBox: 'project'})
    };

    render() {
        return (
            <div className="Conversation">
                <div className="row">
                    <div className="col-sm-3 col-md-3 col-lg-3 channels-contacts">
                        <h4>
                            Projects channel
                        </h4>
                        {this.state.projects.map(project => <div className="channel-or-contact-list" key={project._id} onClick={() => this.changeCurrentChannel(project)}>
                            {project.title}
                        </div>)}
                        <div className="separator"></div>
                        <h4>
                            Contacts
                        </h4>
                        {this.state.contacts.map(contact => this.state.user._id === contact._id ? '' : <div className="channel-or-contact-list" key={contact._id} onClick={() => this.changeCurrentContact(contact)}>
                            {contact.username}
                        </div>)}
                    </div>
                    <div className="col-sm-9 col-md-9 col-lg-9">
                        <div className="channel-contact-info">
                            <span>
                                {this.state.currentConversationBox == 'project' ? this.state.currentChannelOrContact.title : ''}
                                {this.state.currentConversationBox == 'contact' ? this.state.currentChannelOrContact.username : ''}
                            </span>
                        </div>
                        <div className="separator"></div>
                        <div className="messages-container">
                            Message will be rendered here
                        </div>
                        <div className="chat-text-box">
                            <form onSubmit={this.handleMessageSubmit}>
                                    <input name="message" onChange={this.handleMessageInputChange}
                                              value={this.state.message}
                                              className="form-control input-sm" id="description"
                                              placeholder="Type here and press enter ..." required/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Conversation;
