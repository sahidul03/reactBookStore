import {getRequest} from './common/commonApiGetway';

export  const getUser = () => {
    return getRequest('/current_user');
};

export  const getAllUsers = () => {
    return getRequest('/users');
};