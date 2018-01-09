import {getRequest, postRequest} from './common/commonApiGetway';

export  const getConversation = (id) => {
    return getRequest('/conversations/' + id);
};

export  const createConversation = (conversation) => {
    return postRequest('/conversations', conversation);
};
