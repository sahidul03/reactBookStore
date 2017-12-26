import {getRequest, postRequest} from './common/commonApiGetway';
const baseUrl = 'http://localhost:5000';

export  const loadTodos = () => {
   // return fetch(baseUrl + '/todos',{
   //     method: 'GET',
   //     credentials: 'include'
   // })
   //     .then(res => res.json())
    return getRequest('/todos');

};

export  const createTodo = (todo) => {
    // return fetch(baseUrl + '/todos', {
    //     method: 'POST',
    //     body: JSON.stringify(todo)
    // }).then(res => res.json())
    return postRequest('/todos', todo);

};