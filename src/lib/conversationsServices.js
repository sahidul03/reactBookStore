import {getRequest, postRequest} from './common/commonApiGetway';

export  const getConversation = (id) => {
    return getRequest('/conversations/' + id);
};

export  const createConversation = (conversation) => {
    return postRequest('/conversations', conversation);
};

export  const getConversationAccordingToContact = (data) => {
    return postRequest('/conversations/get-conversation-of-contact', data);
};
