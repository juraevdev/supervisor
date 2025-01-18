import React, { useEffect, useState } from "react";
import { fetchAllTodos } from "../utils/api";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetchAllTodos();
        console.log("Fetched todos:", response);
        setTodos(response || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = (id) => {
    fetch(`/api/v1/todos/delete/${id}/`, { method: "DELETE" })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl text-black font-extrabold mb-6">Todos</h1>

      {todos.length === 0 ? (
        <p className="text-black text-lg">No todos found.</p>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="p-2 flex justify-between items-center bg-transparent rounded-md border-2 border-gray-300 shadow-md"
            >
              <div className="text-black">
                <h3 className="text-xl font-semibold">{todo.name}</h3>
                <p className="text-sm mt-1">Planned Time: {todo.planned_time}</p>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
