import config from '../../config';
import openSocket from 'socket.io-client';

const socket = openSocket(config.socketUrl, {transports: ['websocket', 'polling', 'flashsocket']});

// var socket = io('/my-namespace');
// import io from 'socket.io-client';
// const socket = io('http://localhost');


function addComment(data) {
    socket.emit('new-comment', data);
}

function newMessage(data) {
    socket.emit('new-message', data);
}

function joinToTaskRoom(taskId) {
    socket.emit('join', {room: taskId});
}

function joinToConversationRoom(conversationId) {
    socket.emit('join', {room: conversationId});
}

function sendNotificationToUserConversationWillStart(receiverId, senderId, conversationId) {
    socket.emit('sendNotificationToUserConversationWillStart', {conversation: conversationId, receiver: receiverId, sender: senderId});
}

function sendNotificationForAcceptFriendRequest(receiverId, sender) {
    socket.emit('sendNotificationForAcceptFriendRequest', {receiver: receiverId, sender: sender});
}

function joinALlProjectsAndSelfUserRoom(userId) {
    // socket.on('connect', () => {
    //     // emiting to everybody
    //
    // })
    socket.emit('joinAllProjectsAndSelfUser', {userId: userId});
}

function appendComment(fn) {
    socket.on('append-comment', comment => fn(comment));
}

function appendMessage(fn) {
    socket.on('append-message', data => fn(data));
}

function willGetMessageFromThisConversation(fn) {
    socket.on('willGetMessageFromThisConversation', data => fn(data));
}
function getNotificationForAcceptFriendRequest(fn) {
    socket.on('getNotificationForAcceptFriendRequest', data => fn(data));
}

export {
    addComment,
    appendComment,
    joinToTaskRoom,
    joinALlProjectsAndSelfUserRoom,
    appendMessage,
    newMessage,
    joinToConversationRoom,
    willGetMessageFromThisConversation,
    sendNotificationToUserConversationWillStart,
    getNotificationForAcceptFriendRequest,
    sendNotificationForAcceptFriendRequest
};
