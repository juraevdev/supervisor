import React, { useEffect, useState } from "react";
import { fetchOutcomes, fetchWeeklyOutcomes, fetchMonthlyOutcomes, deleteOutcome, UpdateOutcome } from "../utils/api";
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";


const Expense = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [dateTotal, setDateTotal] = useState(0);
  const [refresh, setRefresh] = useState(true);

  // Menu and Dialog states
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedOutcome, setEditedOutcome] = useState({ expense: "", amount: "" });
  const [editingId, setEditingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Handle opening and closing menus
  const handleMenuClick = (id, event) => {
    setOpenMenuId(openMenuId === id ? null : id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };

  // Handle dialog for editing
  const handleOpenDialog = (outcome) => {
    setEditedOutcome({ expense: outcome.expense, amount: outcome.amount });
    setEditingId(outcome.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleEdit = (outcome) => {
    handleOpenDialog(outcome);
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

  const handleDelete = async (id) => {
    try {
      await deleteOutcome(id);
      setRefresh((prev) => !prev);
      handleCloseMenu();
    } catch (error) {
      console.error("Error deleting outcome:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/expenses/outcome/list/`, {
          params: { date: formattedDate },
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });
        const fetchedData = response.data?.outcomes || [];
        setExpenseData(fetchedData);
        setDateTotal(response.data.total || 0);
        setOpenModal(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    const fetchAllOutcomes = async () => {
      try {
        const [dailyData, weeklyData, monthlyData] = await Promise.all([
          fetchOutcomes(),
          fetchWeeklyOutcomes(),
          fetchMonthlyOutcomes(),
        ]);
        setOutcomes(dailyData.outcomes || []);
        setTodayTotal(dailyData.total || 0);
        setWeeklyTotal(weeklyData.weekly_total || 0);
        setMonthlyTotal(monthlyData.monthly_total || 0);
      } catch (error) {
        console.error("Error fetching outcomes:", error);
      }
    };

    fetchAllOutcomes();
  }, [refresh]);


  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-8 bg-white shadow-lg rounded-lg" style={{ marginTop: "20px" }}>
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Today's Expenses</h1>
        <div className="text-lg font-semibold mb-6 text-center text-gray-800">
          Total for today: <span className="text-green-500">{todayTotal} so'm</span>
        </div>
        <div className="space-y-6">
          {outcomes.map((outcome) => (
            <div key={outcome.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
              <div className="text-lg font-medium">{outcome.expense}</div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-700">{outcome.amount} so'm</span>
                <IconButton onClick={(event) => handleMenuClick(outcome.id, event)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenuId === outcome.id}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => handleEdit(outcome)}>Edit</MenuItem>
                  <MenuItem onClick={() => handleDelete(outcome.id)}>Delete</MenuItem>
                </Menu>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <TextField
              label="Expense Name"
              fullWidth
              value={editedOutcome.expense}
              onChange={(e) => setEditedOutcome({ ...editedOutcome, expense: e.target.value })}
            />
            <TextField
              label="Amount"
              fullWidth
              type="number"
              value={editedOutcome.amount}
              onChange={(e) => setEditedOutcome({ ...editedOutcome, amount: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <div className="mt-8 flex justify-center gap-4">
        <Link to="/expenses">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            See All
          </button>
        </Link>
        <Link to="/add-expense">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            Add
          </button>
        </Link>
      </div>


        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
          <div className="flex justify-center items-center gap-4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Choose a date"
              className="border px-4 py-2 rounded-md"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedDate}
              onClick={handleSubmit}
            >
              Get Data
            </Button>
          </div>
          {expenseData && expenseData.length > 0 ? (
            <div>
              <h2 id="modal-title">Expense Data for {selectedDate ? selectedDate.toDateString() : ""}</h2>
              {expenseData.map((outcome, index) => (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }} key={index}>
                  <div style={{ flex: 1 }}>
                    <label>Expense Name:</label>
                    <input
                      type="text"
                      value={outcome.expense || ""}
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Amount:</label>
                    <input
                      type="text"
                      value={outcome.amount || ""}
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label>Total</label>
                  <input
                    type="text"
                    value={dateTotal}
                    readOnly
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">View More</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <span className="font-medium">This week</span>
              <span className="font-bold text-gray-700">{weeklyTotal} so'm</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <span className="font-medium">This month</span>
              <span className="font-bold text-gray-700">{monthlyTotal} so'm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expense;
