import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Check, X } from 'lucide-react';
import { fetchAllTodos, addTodo, deleteTodo, updateTodo } from '../utils/client/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState({ name: "" });
  const [refresh, setRefresh] = useState(true);


  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newItem = await addTodo(newTodo);
      if (newItem) {
        setTodos([...todos, { id: newItem.id, text: newItem.name, completed: false }]);
        setNewTodo('');
        setRefresh((prev) => !prev);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    if (await deleteTodo(id)) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const handleToggleTodo = async (id, completed) => {
    if (await updateTodo(id, { completed: !completed })) {
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
    }
  };

  // const handleSaveEdit = async (id) => {
  //   if (await updateTodo(id, { name: editText })) {
  //     setTodos(todos.map(todo => todo.id === id ? { ...todo, name: editText } : todo));
  //     setRefresh((prev) => !prev);
  //     setEditingId(null);
  //   }
  // };

  const handleSaveEdit = async () => {
    try {
      const updatedTodo = { name: editText };
      await updateTodo(editingId, updatedTodo);

      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, name: editText } : todo
      ));

      setEditingId(null);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };



  useEffect(() => {
    const loadTodos = async () => {
      const data = await fetchAllTodos();
      setTodos(data);
    };
    loadTodos();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Todo List</h1>

        <form onSubmit={handleAddTodo} className="mb-8 flex gap-2 text-white">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2">
            <PlusCircle size={20} /> Add
          </button>
        </form>

        <div className="space-y-3">
          {todos.length > 0 ? (
            todos.map(todo => (
              <div key={todo.id} className="bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow w-full">
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText.name}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 border border-indigo-300 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button onClick={() => handleSaveEdit(todo.id)} className="text-green-600 hover:text-green-700 cursor-pointer">
                      <Check size={20} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-700 cursor-pointer">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id, todo.completed)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 flex-shrink-0 cursor-pointer"
                    />
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>{todo.name}</span>
                    {/* <button onClick={() => setEditingId(todo.id)} className="text-gray-500 hover:text-indigo-600">
                      <Edit size={20} />
                    </button> */}
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditText({ name: todo.name });
                      }}
                      className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() => {
                        console.log("Deleting todo with ID:", todo.id);
                        handleDeleteTodo(todo.id);
                      }}
                      className="text-gray-500 hover:text-red-600 cursor-pointer"
                    >
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
