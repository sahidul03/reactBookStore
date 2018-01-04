import {getRequest, postRequest} from './common/commonApiGetway';

export  const createComment = (comment) => {
    return postRequest('/comments', comment);
};
