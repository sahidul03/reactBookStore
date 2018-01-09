import config from '../../config';
import openSocket from 'socket.io-client';
const socket = openSocket(config.socketUrl, {transports: ['websocket', 'polling', 'flashsocket']});

// var socket = io('/my-namespace');
// import io from 'socket.io-client';
// const socket = io('http://localhost');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function addComment(data) {
    socket.emit('new-comment', data);
}
function newMessage(data) {
    socket.emit('new-message', data);
}
function joinToTaskRoom(taskId) {
    // socket.on('connect', () => {
    //     // emiting to everybody
    //
    // })
    socket.emit('join', { room: taskId });
}
function joinALlProjectsAndSelfUserRoom(userId) {
    // socket.on('connect', () => {
    //     // emiting to everybody
    //
    // })
    socket.emit('joinAllProjectsAndSelfUser', { userId: userId });
}

function appendComment(fn) {
    socket.on('append-comment', comment => fn(comment));
}
function appendMessage(fn) {
    socket.on('append-message', data => fn(data));
}
export { subscribeToTimer, addComment, appendComment, joinToTaskRoom, joinALlProjectsAndSelfUserRoom, appendMessage, newMessage };