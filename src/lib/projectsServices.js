import {getRequest, postRequest} from './common/commonApiGetway';

export  const getProject = (id) => {
    return getRequest('/projects/' + id);
};

export  const getMinProject = (id) => {
    return getRequest('/min-projects/' + id);
};

export  const createProject = (project) => {
    return postRequest('/projects', project);
};