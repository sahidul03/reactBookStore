import React, {Component} from 'react';
import {getConversation, getConversationAccordingToContact} from '../../lib/conversationsServices';
import {getCurrentUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest} from '../../lib/usersServices';
import Timestamp from 'react-timestamp';
import config from '../../config';
import {
    NavLink
} from 'react-router-dom';
import {
    appendMessage,
    sendNotificationToUserConversationWillStart,
    willGetMessageFromThisConversation,
    newMessage,
    joinALlProjectsAndSelfUserRoom,
    joinToConversationRoom,
    getNotificationForAcceptFriendRequest,
    sendNotificationForAcceptFriendRequest
} from '../../lib/socket/sampleService';

class Conversation extends Component {
    state = {
        allMessages: {},
        user: '',
        projects: [],
        contacts: [],
        ownProjects: [],
        sentFriendRequests: [],
        gotFriendRequests: [],
        message: '',
        currentChannelOrContact: '',
        currentConversationBox: ''
    };

    componentDidMount() {
        appendMessage((data) => {
                let tempAllMessages = this.state.allMessages;
                if (tempAllMessages[data.conversation] === undefined) {
                    tempAllMessages[data.conversation] = [];
                }
                tempAllMessages[data.conversation].push(data);
                this.setState({allMessages: tempAllMessages});
                console.log('message :', data);
                this.refs.messagesContainer.scrollTop = document.querySelector('.messages-container').scrollHeight;
                if (this.state.currentChannelOrContact.conversation !== data.conversation) {
                    this.newMessageFound(data.conversation);
                }
            }
        );
        willGetMessageFromThisConversation((data) => {
                joinToConversationRoom(data.conversation);
                let tempContacts = this.state.contacts;
                let existingContact = tempContacts.find(contact => {
                    return contact._id === data.sender
                });
                let index = tempContacts.indexOf(existingContact);
                if (index > -1) {
                    tempContacts[index]['conversation'] = data.conversation;
                }
                this.setState({contacts: tempContacts});
                this.getMessagesOfConversations(data.conversation);

            }
        );
        getNotificationForAcceptFriendRequest((data) => {
                joinToConversationRoom(data.sender.conversation);
                let tempContacts = this.state.contacts;
                let tempAllMessages = this.state.allMessages;
                tempContacts.push(data.sender);
                tempAllMessages[data.sender.conversation] = [];
                this.setState({contacts: tempContacts, allMessages: tempAllMessages});

            }
        );
        getCurrentUser().then(
            user => {
                joinALlProjectsAndSelfUserRoom(user._id);
                this.setState({
                    user: user,
                    projects: user.projects,
                    ownProjects: user.ownProjects,
                    contacts: user.contacts,
                    gotFriendRequests: user.gotFriendRequests,
                    sentFriendRequests: user.sentFriendRequests
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
            this.refs.messagesContainer.scrollTop = document.querySelector('.messages-container').scrollHeight;
        });
    };

    changeCurrentContact = (contact) => {
        if (contact.conversation) {
            this.setState({currentChannelOrContact: contact, currentConversationBox: 'contact'});
            if (this.state.allMessages[contact.conversation]) {
                this.setState({
                    currentChannelOrContact: contact,
                    currentConversationBox: 'contact'
                });
                setTimeout(() => {
                    this.refs.messagesContainer.scrollTop = document.querySelector('.messages-container').scrollHeight;
                }, 100);
            } else {
                let tempAllMessages = this.state.allMessages;
                tempAllMessages[contact.conversation] = [];
                this.setState({
                    currentChannelOrContact: contact,
                    currentConversationBox: 'contact',
                    allMessages: tempAllMessages
                });
                this.getMessagesOfConversations(contact.conversation);
            }
            this.removeNewMessage(contact.conversation);
        } else {
            this.pleaseGetConversationAccordingToContact(contact._id)
        }
    };

    pleaseGetConversationAccordingToContact = (contactId) => {
        let data = {users: [this.state.user._id, contactId]};
        getConversationAccordingToContact(data).then(conv => {
            joinToConversationRoom(conv._id);
            sendNotificationToUserConversationWillStart(contactId, this.state.user._id, conv._id);
            let tempAllMessages = this.state.allMessages;
            tempAllMessages[conv._id] = conv.messages;
            let tempContacts = this.state.contacts;
            let existingContact = tempContacts.find(contact => {
                return contact._id === contactId
            });
            let index = tempContacts.indexOf(existingContact);
            if (index > -1) {
                tempContacts[index]['conversation'] = conv._id;
            }
            this.setState({
                allMessages: tempAllMessages,
                contacts: tempContacts
            });
            this.changeCurrentContact(existingContact);
        });
    };

    changeCurrentChannel = (channel) => {
        if (this.state.allMessages[channel.conversation]) {
            this.setState({
                currentChannelOrContact: channel,
                currentConversationBox: 'project'
            });
            setTimeout(() => {
                this.refs.messagesContainer.scrollTop = document.querySelector('.messages-container').scrollHeight;
            }, 100);
        } else {
            let tempAllMessages = this.state.allMessages;
            tempAllMessages[channel.conversation] = [];
            this.setState({
                currentChannelOrContact: channel,
                currentConversationBox: 'project',
                allMessages: tempAllMessages
            });
            this.getMessagesOfConversations(channel.conversation);
        }
        this.removeNewMessage(channel.conversation);
    };

    newMessageFound = (conversationId) => {
        // if(this.state.currentConversationBox === 'project'){
        let tempProjects = this.state.projects;
        var project = tempProjects.find(project => {
            return project.conversation === conversationId
        });
        var index = tempProjects.indexOf(project);
        if (index > -1) {
            if (tempProjects[index]['new_message']) {
                tempProjects[index]['new_message'] += 1;
            } else {
                tempProjects[index]['new_message'] = 1;
            }
        }
        this.setState({projects: tempProjects});
        // }else {
        let tempContacts = this.state.contacts;
        var contact = tempContacts.find(contact => {
            return contact.conversation === conversationId
        });
        index = tempContacts.indexOf(contact);
        if (index > -1) {
            if (tempContacts[index]['new_message']) {
                tempContacts[index]['new_message'] += 1;
            } else {
                tempContacts[index]['new_message'] = 1;
            }
        }
        this.setState({contacts: tempContacts});
        // }
    };

    removeNewMessage = (conversationId) => {
        // if(this.state.currentConversationBox == 'project'){
        let tempProjects = this.state.projects;
        var project = tempProjects.find(project => {
            return project.conversation === conversationId
        });
        var index = tempProjects.indexOf(project);
        if (index > -1) {
            tempProjects[index]['new_message'] = 0;
        }
        this.setState({projects: tempProjects});
        // }else {
        let tempContacts = this.state.contacts;
        var contact = tempContacts.find(contact => {
            return contact.conversation === conversationId
        });
        index = tempContacts.indexOf(contact);
        if (index > -1) {
            tempContacts[index]['new_message'] = 0;
        }
        this.setState({contacts: tempContacts});
        // }
    };

    showHideProjectMembers = () => {
        let tempProject = this.state.currentChannelOrContact;
        if (tempProject.showMembers) {
            tempProject.showMembers = false;
        } else {
            tempProject.showMembers = true;
        }
        this.setState({currentChannelOrContact: tempProject})
    };

    showRelationShipWithMember = (memberId, evt) => {
        evt.stopPropagation();
        if (evt.target.children.length === 0) {
            let memberRelationship = document.createElement("span");
            memberRelationship.className = "member-relationship";
            var contact = this.state.contacts.find(contact => {
                return contact._id === memberId
            });
            let content = null;
            let textOfButton = null;
            if (memberId === this.state.user._id) {
                content = document.createElement("label");
                textOfButton = document.createTextNode("It's me");
                content.className = "label label-success label-sm";
            }
            else if (contact) {
                content = document.createElement("label");
                textOfButton = document.createTextNode("Already added");
                content.className = "label label-success label-sm";
            } else {
                var sentRequest = this.state.sentFriendRequests.indexOf(memberId);
                var gotRequest = this.state.gotFriendRequests.indexOf(memberId);
                if (sentRequest > -1) {
                    content = document.createElement("label");
                    textOfButton = document.createTextNode("Sent Request");
                    content.className = "label label-success label-sm";
                }
                else if (gotRequest > -1) {
                    content = document.createElement("button");
                    textOfButton = document.createTextNode("Accept");
                    content.className = "btn btn-success btn-xs";
                    content.onclick = (e) => {
                        this.pleaseAcceptFriendRequest(e, memberId);
                    };
                    let rejectButton = document.createElement("button");
                    let textOfRejectButton = document.createTextNode("Reject");
                    rejectButton.className = "btn btn-danger btn-xs";
                    rejectButton.onclick = (e) => {
                        this.pleaseRejectFriendRequest(e, memberId);
                    };
                    rejectButton.appendChild(textOfRejectButton);
                    memberRelationship.appendChild(rejectButton);
                }
                else {
                    content = document.createElement("button");
                    textOfButton = document.createTextNode("Add to Contact");
                    content.className = "btn btn-success btn-xs";
                    content.onclick = (e) => {
                        this.pleaseSendFriendRequest(e, memberId);
                    };
                }
            }
            content.appendChild(textOfButton);
            memberRelationship.appendChild(content);
            evt.target.append(memberRelationship);
        } else {
            evt.target.removeChild(evt.target.children[0]);
        }
    };

    pleaseAcceptFriendRequest = (event, memberId) => {
        event.stopPropagation();
        let data = {
            receiver: this.state.user._id,
            sender: memberId
        };
        acceptFriendRequest(data).then(contact => {
            let tempContacts = this.state.contacts;
            let tempAllMessages = this.state.allMessages;
            if (contact.conversation)
                tempAllMessages[contact.conversation] = [];
            tempContacts.push(contact);
            let tempGotFriendRequest = this.state.gotFriendRequests;
            let index = tempGotFriendRequest.indexOf(contact._id);
            if (index !== -1) {
                tempGotFriendRequest.splice(index, 1);
            }
            this.setState({
                gotFriendRequests: tempGotFriendRequest,
                contacts: tempContacts,
                allMessages: tempAllMessages
            });
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            let tempSender = {
                _id: this.state.user._id,
                username: this.state.user.username,
                email: this.state.user.email,
                conversation: contact.conversation
            };
            sendNotificationForAcceptFriendRequest(contact._id, tempSender)
        })
    };

    pleaseRejectFriendRequest = (event, memberId) => {
        event.stopPropagation();
        let data = {
            receiver: this.state.user._id,
            sender: memberId
        };
        rejectFriendRequest(data).then(sender => {
            let tempGotFriendRequest = this.state.gotFriendRequests;
            let index = tempGotFriendRequest.indexOf(sender.sender);
            if (index > -1) {
                tempGotFriendRequest.splice(index, 1);
            }
            this.setState({gotFriendRequests: tempGotFriendRequest});
            event.target.parentNode.parentNode.removeChild(event.target.parentNode)
        })
    };

    pleaseSendFriendRequest = (event, memberId) => {
        event.stopPropagation();
        let data = {
            sender: this.state.user._id,
            receiver: memberId
        };
        sendFriendRequest(data).then(receiver => {
            let tempSendFriendRequest = this.state.sentFriendRequests;
            tempSendFriendRequest.push(receiver.receiver);
            this.setState({sentFriendRequests: tempSendFriendRequest});
            event.target.parentNode.parentNode.removeChild(event.target.parentNode)
        })
    };

    render() {
        return (
            <div className="Conversation">
                <div className="row">
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 channels-contacts">
                        <h4>
                            Projects channel
                        </h4>
                        {this.state.projects.map(project => <div className="channel-or-contact-list" key={project._id}
                                                                 onClick={() => this.changeCurrentChannel(project)}>
                            {project.title}{project.new_message ?
                            <span className="new-message-icon pull-right">{project.new_message}</span> : ''}
                        </div>)}
                        <div className="separator"></div>
                        <h4>
                            Contacts
                        </h4>
                        {this.state.contacts.map(contact => this.state.user._id === contact._id ? '' :
                            <div className="channel-or-contact-list" key={contact._id}
                                 onClick={() => this.changeCurrentContact(contact)}>
                                {contact.username}
                                {contact.new_message ?
                                    <span className="new-message-icon pull-right">{contact.new_message}</span> : ''}
                            </div>)}
                    </div>
                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 conversation-rendering messages">
                        <div className="channel-contact-info">
                            <span>
                                {this.state.currentConversationBox === 'project' ? <span>
                                    <img src="/images/group-2.png" alt="" className="group-single-chat-image"/>
                                    {this.state.currentChannelOrContact.title}
                                    <span onClick={this.showHideProjectMembers}
                                          className="project-members">Members({this.state.currentChannelOrContact.members.length})</span>
                                    <span className="group-single-chat-title">Group conversation</span>
                                </span> : ''}
                                {this.state.currentConversationBox === 'contact' ? <span>
                                    <img
                                        src={config.backendBaseUrl + this.state.currentChannelOrContact.photo}
                                        alt="" className="group-single-chat-image"/>
                                    {this.state.currentChannelOrContact.username}
                                    <span className="group-single-chat-title">Private conversation</span>
                                    </span> : ''}
                            </span>
                            {(this.state.currentConversationBox === 'project' && this.state.currentChannelOrContact.showMembers === true) ?
                                <div className="group-members">
                                    {this.state.currentChannelOrContact.members.map(member =>
                                        <span className="member-list" key={member._id}>
                                        {member.username} <span className="cursor-pointer">
                                        <i className="fa fa-info-circle position-relative"
                                           onClick={this.showRelationShipWithMember.bind(this, member._id)}></i>
                                    </span>
                                    </span>)}
                                </div> : ''}
                        </div>
                        {/*<div className="separator"></div>*/}
                        <ul ref="messagesContainer" className="messages-container">
                          {this.state.currentChannelOrContact ? this.state.allMessages[this.state.currentChannelOrContact.conversation].map(message =>
                            <li
                              key={message._id} className={message.sender._id == this.state.user._id ? 'replies' : 'sent'}>
                                <img src={config.backendBaseUrl + message.sender.photo} alt={message.sender.username} />
                              <p>
                                <span className="message_body">{message.body}</span><br/>
                                <span className="date_time">
                                  <Timestamp time={message.updated_at} twentyFourHour autoUpdate={60}/>
                                </span>
                              </p>

                            </li>) : ''}
                        </ul>
                        <div className="chat-text-box">
                            <form onSubmit={this.handleMessageSubmit}>
                                <input name="message" onChange={this.handleMessageInputChange}
                                       value={this.state.message}
                                       className="form-control input-sm" id="description"
                                       autoComplete="off"
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
