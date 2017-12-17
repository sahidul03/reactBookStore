const baseUrl = 'http://localhost:5000';

export  const loadTodos = () => {
   return fetch(baseUrl + '/todos')
       .then(res => res.json())

};

export  const createTodo = (todo) => {
    console.log(todo);
    return fetch(baseUrl + '/todos', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo)
    }).then(res => res.json())

};