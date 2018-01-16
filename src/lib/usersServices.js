import {getRequest, postRequest} from './common/commonApiGetway';

export  const getCurrentUser = () => {
    return getRequest('/current_user');
};

export  const getAllUsers = () => {
    return getRequest('/users');
};

export  const getUser = (id) => {
    return getRequest('/users/' + id);
};

export  const sendFriendRequest = (data) => {
    return postRequest('/send-friend-request', data);
};

export  const acceptFriendRequest = (data) => {
    return postRequest('/accept-friend-request', data);
};

export  const rejectFriendRequest = (data) => {
    return postRequest('/reject-friend-request', data);
};
