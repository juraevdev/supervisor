import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Check, X } from 'lucide-react';
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/todos/";

function App() {
  const [todos, setTodos] = useState([]); // Default array
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // ✅ TODOS NI BACKEND'DAN OLISH
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        console.log("Fetched todos:", response.data);
        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          setTodos([]); // Xatolik bo'lsa bo'sh array beramiz
        }
      })
      .catch(error => console.error("Error fetching todos:", error));
  }, []);

  // ✅ YANGI TODO QO‘SHISH
  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        const response = await axios.post(`${API_URL}create/`, { text: newTodo });
        setTodos([...todos, { id: response.data.id, text: newTodo, completed: false }]);
        setNewTodo('');
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  // ✅ TODO O‘CHIRISH
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}delete/${id}/`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // ✅ TODO STATUSINI O‘ZGARTIRISH (BAJARILGAN YOKI YO‘Q)
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}edit/${id}/`, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // ✅ TODO TAHIRLASH BOSHLANDI
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // ✅ TODO O‘ZGARTIRISHNI SAQLASH
  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}edit/${id}/`, { text: editText });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">Todo List</h1>

        {/* ✅ Yangi todo qo'shish */}
        <form onSubmit={addTodo} className="mb-8 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add
          </button>
        </form>

        {/* ✅ Todo ro‘yxati */}
        <div className="space-y-3">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map(todo => (
              <div key={todo.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow w-full">
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={() => saveEdit(todo.id)} className="text-green-600 hover:text-green-700">
                      <Check size={20} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-700">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 flex-shrink-0"
                    />
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.text}</span>
                    <button onClick={() => startEdit(todo)} className="text-gray-500 hover:text-indigo-600">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-gray-500 hover:text-red-600">
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">No todos yet. Add one to get started!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
