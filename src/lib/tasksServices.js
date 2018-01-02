import {getRequest, postRequest} from './common/commonApiGetway';

export  const getTask = (id) => {
    return getRequest('/tasks/' + id);
};

export  const createTask = (task) => {
    return postRequest('/tasks', task);
};