import React, { useState } from "react";
import "./App.css";
import { Todo, rootStore } from "./store";
import { Provider, observer } from "mobx-react";

const App = observer(() => {
  const [todo, setTodo] = useState<string>("");

  const addTodo = () => {
    if (!todo) return;
    rootStore.todos.add(todo);
    setTodo("");
  };
  
  return (
    <Provider value={rootStore}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 300,
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <input value={todo} onChange={(e) => setTodo(e.target.value)} />
        <button onClick={addTodo}>Add todo</button>
        {rootStore.todos
          .getAll()
          .reverse()
          .map((todo: Todo) => {
            return (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                key={todo.id}
              >
                <input
                  id={todo.id.toString()}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    todo.toggle();
                  }}
                />
                <label htmlFor={todo.id.toString()}>{todo.title}</label>
                <button onClick={() => rootStore.todos.delete(todo.id)}>
                  Delete
                </button>
              </div>
            );
          })}
      </div>
    </Provider>
  );
});

export default App;
