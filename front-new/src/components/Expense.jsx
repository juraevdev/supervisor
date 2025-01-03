import React, { useEffect, useState } from "react";
import { fetchOutcomes, fetchWeeklyOutcomes, fetchMonthlyOutcomes } from "../utils/api";
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { api, API_BASE_URL } from "../api";

const Expense = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [expenseData, setExpenseData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (id) => {
    console.log(id);
    handleOpenDialog();
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().slice(0, 10); 

      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/expenses/selected_date/`, {
          params: { date: formattedDate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          }
        });
        setExpenseData(response.data);
        console.log("Backend response:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      alert("Please select a date.");
    }
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
        setTotal(dailyData.total || 0);
        setWeeklyTotal(weeklyData.weekly_total || 0);
        setMonthlyTotal(monthlyData.monthly_total || 0);
      } catch (error) {
        console.error("Error fetching outcomes:", error);
      }
    };

    fetchAllOutcomes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Today's Expenses</h1>
      <div className="text-lg font-semibold mb-6">Total for today: {total} so'm</div>
      <div className="space-y-4">
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium bg-none rounded-lg shadow-sm w-[50px] h-[50px] flex justify-center items-center">
                {outcome.expense}
              </h2>
            </div>
            <div className="text-lg font-bold flex gap-[10px] items-center">
              <span>{outcome.amount} so'm </span>
              <div>
                <button className="text-lg font-medium bg-gray-100 rounded-lg shadow-sm w-[50px] h-[50px] flex justify-center items-center">
                  <IconButton
                    aria-label="actions"
                    onClick={handleClick}
                    aria-controls={open ? "actions-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="actions-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "actions-button",
                    }}
                  >
                    <MenuItem onClick={() => handleEdit(outcome.id)}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Make changes to the selected item:
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Edit Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Edit Price"
                        type="text"
                        fullWidth
                        variant="outlined"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button onClick={() => alert("Changes saved!")}>Save</Button>
                    </DialogActions>
                  </Dialog>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        <button className="w-[50%] py-2 bg-gray-200 text-black rounded-lg shadow-md hover:bg-gray-300">
          See All
        </button>
        <Link to="/add-expence">
          <button className="flex w-[50%] my-7 py-2 bg-gray-200 flex justify-center items-center text-black rounded-lg shadow-md hover:bg-gray-300">
            Add Expense
          </button>
        </Link>
      </div>
      <div>
        <h1>Select a Date</h1>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Choose a date"
        />
        <button onClick={handleSubmit}>Get Data</button>
        {expenseData && (
          <div>
            <h2>Expense Data for {selectedDate ? selectedDate.toDateString() : ""}</h2>
            <div>
              <label>Expense Name:</label>
              <input type="text" value={expenseData.expense || ""} readOnly />
            </div>
            <div>
              <label>Amount:</label>
              <input type="text" value={expenseData.amount || ""} readOnly />
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">View more</h2>
        <div className="space-y-2 mt-2">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>This week</span>
            <span>Total: {weeklyTotal} so'm</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span>This month</span>
            <span>Total: {monthlyTotal} so'm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
