import config from '../../config';
import openSocket from 'socket.io-client';
const socket = openSocket(config.socketUrl);

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function addComment(data) {
    socket.emit('new-comment', data);
}
function appendComment(fn) {
    socket.on('append-comment', comment => fn(comment));
}
export { subscribeToTimer, addComment, appendComment };