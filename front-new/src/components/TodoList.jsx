import React, { useEffect, useState } from "react";
import { fetchAllTodos } from "../utils/api";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { API_BASE_URL } from '../services/api';
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [plannedTime, setPlannedTime] = useState("");
  const [user, setUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("access");
    axios.get(API_BASE_URL + '/api/v1/accounts/profile/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log(response, "me data");
            setUser(response?.data?.first_name || 'User');
        })
        .catch(error => {
            console.log(error);
        });
}, []);

const addFunc = () => {
  if (!name || !plannedTime) {
      alert("Please fill in all fields.");
      return;
  }

  const today = new Date();
  const formattedDate = today.toISOString();

  const data = {
    user: user,
    day: formattedDate,
    name: name,
    plannedTime: plannedTime
};

  const token = localStorage.getItem("access");

  axios.post(`${API_BASE_URL}/api/v1/todos/create/`, data, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  })
      .then(response => {
          console.log(response, "response from post request");
          setName('');
          setPlannedTime('');
      })
      .catch(error => {
          console.log(error);
      });
}

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
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Todo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add a New Todo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Planned Time"
            type="time"
            value={plannedTime}
            onChange={(e) => setPlannedTime(e.target.value)}
            margin="dense"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addFunc}
            style={{ marginTop: "10px" }}
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>
        </div>
      )}
    </div>
  );
}

export default TodoList;
