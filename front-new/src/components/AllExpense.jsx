import React, { useEffect, useState } from "react";
import { fetchAllOutcomes, deleteOutcome, UpdateOutcome } from "../utils/api";
import { IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Expense = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedOutcome, setEditedOutcome] = useState({ expense: "", amount: "" });
  const [editingId, setEditingId] = useState(null);

  const handleOpenDialog = (outcome) => {
    setEditedOutcome({ expense: outcome.expense, amount: outcome.amount });
    setEditingId(outcome.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedOutcome({ expense: "", amount: "" });
    setEditingId(null);
    handleCloseMenu(true);
  };

  const handleMenuClick = (id, event) => {
    setOpenMenuId(openMenuId === id ? null : id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteOutcome(id);
        setRefresh((prev) => !prev);
        handleCloseMenu();
      } catch (error) {
        console.error("Error deleting outcome:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedData = {
        expense: editedOutcome.expense,
        amount: editedOutcome.amount,
      };
      await UpdateOutcome(editingId, updatedData);
      setRefresh((prev) => !prev);
      handleCloseDialog();
      handleCloseMenu();
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetchAllOutcomes();
        setOutcomes(response.outcomes || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error("Error fetching outcomes:", error);
      }
    };
    fetchExpenses();
  }, [refresh]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">All Expenses</h1>
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-lg p-4 mb-8 shadow-md text-center">
        Total: <span className="font-bold text-xl">{total.toLocaleString("uz-UZ", { style: "currency", currency: "UZS" })}</span>
      </div>
      <div className="space-y-6">
        {outcomes.map((outcome) => (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }} key={outcome.id}>
            <TextField label="Expense Name" value={outcome.expense || ""} fullWidth />
            <TextField label="Amount" value={outcome.amount || ""} fullWidth />
            <IconButton
              aria-label="actions"
              onClick={(event) => handleMenuClick(outcome.id, event)}
              aria-controls={openMenuId === outcome.id ? "actions-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenuId === outcome.id ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              open={openMenuId === outcome.id}
              onClose={handleCloseMenu}
              MenuListProps={{ "aria-labelledby": "actions-button" }}
            >
              <MenuItem onClick={() => handleOpenDialog(outcome)}>Edit</MenuItem>
              <MenuItem onClick={() => handleDelete(outcome.id)}>Delete</MenuItem>
            </Menu>
          </div>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Expense Name"
            value={editedOutcome.expense}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, expense: e.target.value }))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            value={editedOutcome.amount}
            onChange={(e) => setEditedOutcome((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Expense;