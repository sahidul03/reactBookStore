import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId} from './lib/todoHelpers';
import {loadTodos, createTodo} from './lib/todoServices';

class App extends Component {
    state = {
        todos: [],
        currentTodo: ''
    };

    componentDidMount(){
        loadTodos().then(
            todos => this.setState({todos})
        )
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.currentTodo) {
            // const newId = generateId();
            const newTodo = {
                name: this.state.currentTodo,
                isComplete: false
            };
            createTodo(newTodo).then( todo => {
                const updatedTodos = addTodo(this.state.todos, todo);
                this.setState({todos: updatedTodos, currentTodo: ''});
            }
            )
        }
    };

    handleInputChange = (evt) => {
        this.setState({
            currentTodo: evt.target.value
        })
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2 className="App-title">React Todos</h2>
                </header>
                <div className="Todo-App">
                    <TodoForm
                        handleSubmit={this.handleSubmit}
                        handleInputChange={this.handleInputChange}
                        currentTodo={this.state.currentTodo}/>
                    <TodoList todos={this.state.todos}></TodoList>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default App;
