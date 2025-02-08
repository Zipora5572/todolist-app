import React, { useEffect, useState } from 'react';
import toDoService from '../services/toDoService';
import CircularProgress from '@mui/material/CircularProgress';

function ToDoList() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getTodos() {
    const todos = await toDoService.getTasks();
    setTodos(todos);
    setLoading(false);
  }

  async function createTodo(e) {
    e.preventDefault();
    await toDoService.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await toDoService.setCompleted(todo.id, isComplete);
    await getTodos();
  }

  async function deleteTodo(id) {
    await toDoService.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) {
        getTodos();
      }
    }, 2000);

    getTodos();

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <section className="todoapp">
      <header className="header">
        <form onSubmit={createTodo}>
          <input 
            className="new-todo" 
            placeholder="Well, let's take on the day" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress />
            <p style={{ marginLeft: '10px' }}>Loading...</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map(todo => {
              return (
                <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                  <div className="view">
                    <input 
                      className="toggle" 
                      type="checkbox" 
                      defaultChecked={todo.isComplete} 
                      onChange={(e) => updateCompleted(todo, e.target.checked)} 
                    />
                    <label>{todo.name}</label>
                    <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}

export default ToDoList;
