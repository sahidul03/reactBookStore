import {getRequest, postRequest} from './common/commonApiGetway';

export  const getTask = (id) => {
    return getRequest('/tasks/' + id);
};

export  const getMinTask = (id) => {
    return getRequest('/min-tasks/' + id);
};

export  const createTask = (task) => {
    return postRequest('/tasks', task);
};

export  const addAssigneeToTask = (data) => {
    return postRequest('/add-assignee', data);
};