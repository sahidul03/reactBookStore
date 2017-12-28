import {getRequest, postRequest} from './common/commonApiGetway';

export  const loadTodos = () => {
    return getRequest('/todos');
};

export  const createTodo = (todo) => {
    return postRequest('/todos', todo);
};