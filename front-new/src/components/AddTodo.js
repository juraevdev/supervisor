import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { API_BASE_URL } from '../services/api';

function AddTodo({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [plannedTime, setPlannedTime] = useState("");

  const handleAdd = () => {
    fetch("/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, planned_time: plannedTime }),
    })
      .then((response) => response.json())
      .then((data) => {
        onAdd(data);
        setOpen(false);
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  return (
    <>
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
            onClick={handleAdd}
            style={{ marginTop: "10px" }}
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddTodo;
