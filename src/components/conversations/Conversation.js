import React, {Component} from 'react';
import {getConversation, createConversation} from '../../lib/conversationsServices';
import {getCurrentUser} from '../../lib/usersServices';
import Timestamp from 'react-timestamp';
import {
    NavLink
} from 'react-router-dom';
import {appendMessage, newMessage, joinALlProjectsAndSelfUserRoom} from '../../lib/socket/sampleService';

class Conversation extends Component {
    state = {
        allMessages: {},
        user: '',
        projects: [],
        contacts: [],
        ownProjects: [],
        message: '',
        currentChannelOrContact: '',
        currentConversationBox: ''
    };

    componentDidMount() {
        appendMessage((data) => {
                let tempAllMessages = this.state.allMessages;
                if(tempAllMessages[data.conversation] === undefined){
                    tempAllMessages[data.conversation] = [];
                }
                tempAllMessages[data.conversation].push(data);
                this.setState({allMessages: tempAllMessages});
                console.log('message :', data)
            }
        );
        getCurrentUser().then(
            user => {
                joinALlProjectsAndSelfUserRoom(user._id);
                this.setState({
                    user: user,
                    projects: user.projects,
                    ownProjects: user.ownProjects,
                    contacts: user.contacts
                });
                if (this.state.projects.length > 0) {
                    this.getMessagesOfConversations(this.state.projects[0].conversation);
                    let tempAllMessages = this.state.allMessages;
                    tempAllMessages[this.state.projects[0].conversation] = [];
                    this.setState({
                        currentChannelOrContact: this.state.projects[0],
                        currentConversationBox: 'project',
                        allMessages: tempAllMessages
                    })
                } else if (this.state.projects.length <= 0 && this.state.projects.length > 0) {
                    this.setState({currentChannelOrContact: this.state.contacts[0], currentConversationBox: 'contact'})
                }
            }
        )
    }

    handleMessageSubmit = (evt) => {
        evt.preventDefault();
        let data = {
            message: this.state.message,
            room: this.state.currentChannelOrContact.conversation,
            sender: this.state.user._id
        };
        newMessage(data);
        this.setState({message: ""});
    };

    handleMessageInputChange = (evt) => {
        this.setState({
            message: evt.target.value
        });
    };

    getMessagesOfConversations = (conversationId) => {
        getConversation(conversationId).then(conv => {
            let tempAllMessages = this.state.allMessages;
            tempAllMessages[conversationId] = conv.messages;
            this.setState({
                allMessages: tempAllMessages
            });
            this.refs.messagesContainer.scrollTop = this.refs.messagesContainer.height;
        });
    };

    changeCurrentContact = (contact) => {
        this.setState({currentChannelOrContact: contact, currentConversationBox: 'contact'})
    };
    changeCurrentChannel = (channel) => {
        let tempAllMessages = this.state.allMessages;
        tempAllMessages[channel.conversation] = [];
        this.setState({
            currentChannelOrContact: channel,
            currentConversationBox: 'project',
            allMessages: tempAllMessages
        });
        this.getMessagesOfConversations(channel.conversation)
    };

    render() {
        return (
            <div className="Conversation">
                <div className="row">
                    <div className="col-sm-3 col-md-3 col-lg-3 channels-contacts">
                        <h4>
                            Projects channel
                        </h4>
                        {this.state.projects.map(project => <div className="channel-or-contact-list" key={project._id}
                                                                 onClick={() => this.changeCurrentChannel(project)}>
                            {project.title}
                        </div>)}
                        <div className="separator"></div>
                        <h4>
                            Contacts
                        </h4>
                        {this.state.contacts.map(contact => this.state.user._id === contact._id ? '' :
                            <div className="channel-or-contact-list" key={contact._id}
                                 onClick={() => this.changeCurrentContact(contact)}>
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
                        <div ref="messagesContainer" className="messages-container">
                            {this.state.currentChannelOrContact ? this.state.allMessages[this.state.currentChannelOrContact.conversation].map(message => <div
                                key={message._id} className="message">
                                <div className="message-sender">
                                    <img src="/images/profile-avater.png" className="profile-image" alt={message._id}/>
                                </div>
                                <div className="message-body">
                                    <div className="m-head">
                                        <NavLink className="profile-name"
                                                 to={"/users/" + message.sender._id}>{message.sender.username}</NavLink>
                                        <span className="created-date pull-right"><Timestamp time={message.updated_at} format='full'
                                                                                  includeDay/></span>
                                    </div>
                                    <div className="m-body">
                                        {message.body}
                                    </div>
                                </div>
                                <div className="clear"></div>
                            </div>) : ''}
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
