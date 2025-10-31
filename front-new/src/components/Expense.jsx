import React, { useEffect, useState } from "react";
import { fetchOutcomes, fetchWeeklyOutcomes, fetchMonthlyOutcomes, deleteOutcome, UpdateOutcome } from "../utils/api";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MoreVertical } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


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
    handleCloseMenu();
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
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/expenses/outcome/list/`, {
          params: { date: formattedDate },
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });
        const fetchedData = response.data?.outcomes || [];
        setExpenseData(fetchedData);
        setDateTotal(response.data.total || 0);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(amount)
  }

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
    <div className="bg-gray-900 min-h-screen py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 shadow-lg rounded-lg">
        <div>
          <h1 className="text-3xl font-bold text-center mb-2 text-white">Today's Expenses</h1>
          <p className="text-xl text-white font-bold text-center">
            Total: <span className="text-white ml-2">
              {todayTotal.toLocaleString("uz-UZ", { style: "currency", currency: "UZS" })}
            </span>
          </p>
        </div>


        <div className="p-6">
          <div className="space-y-4">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="flex justify-between items-center p-2 bg-gray border border-gray-200 hover:shadow-lg dark:hover:shadow-slate-700 transition-shadow rounded-lg shadow-md w-full"
              >
                <div className="text-lg font-medium text-white">{outcome.expense}</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{formatCurrency(outcome.amount)}</span>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="cursor-pointer">
                        <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700 text-gray-200">
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer" onClick={() => handleOpenDialog(outcome)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(outcome.id)} className="text-red-500 hover:bg-gray-700 cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent className="bg-gray-800 border border-gray-700 text-white w-full max-w-sm sm:max-w-md px-4 sm:px-6 py-6 mx-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Expense</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expense" className="text-gray-300">
                              Expense Name
                            </Label>
                            <Input
                              id="expense"
                              value={editedOutcome.expense}
                              onChange={(e) =>
                                setEditedOutcome({
                                  ...editedOutcome,
                                  expense: e.target.value,
                                })
                              }
                              className="bg-gray-900 text-white border-gray-700 focus:ring-gray-600 w-full"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="amount" className="text-gray-300">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              value={editedOutcome.amount}
                              onChange={(e) =>
                                setEditedOutcome({
                                  ...editedOutcome,
                                  amount: e.target.value,
                                })
                              }
                              className="bg-gray-900 text-white border-gray-700 focus:ring-gray-600 w-full"
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
                          <Button
                            variant="outline"
                            onClick={handleCloseDialog}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/home/expenses" className="no-underline">
              <button
                className="cursor-pointer px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                See All
              </button>
            </Link>
            <Link to="/home/add-expense" className="no-underline">
              <button
                className="cursor-pointer px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Expense
              </button>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold mb-4 text-white">Select Date</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                isClearable
                placeholderText="Choose a date"
                className="border border-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              />
              <Button variant="contained" disabled={!selectedDate} onClick={handleSubmit} className="text-white cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-transparent">
                Get Data
              </Button>
            </div>

            {expenseData.length > 0 && (
              <div className="mt-6 bg-gray-400 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Expenses for {selectedDate ? selectedDate.toLocaleDateString() : ""}
                </h3>
                <div className="space-y-4">
                  {expenseData.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-md bg-gray-200">
                      <span className="font-medium">{expense.expense}</span>
                      <span className="font-bold">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-md bg-teal-50 font-bold">
                    <span>Total</span>
                    <span className="text-teal-700">{formatCurrency(dateTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 bg-gray-400 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-200 border border-gray-200">
                <span className="font-medium">This week</span>
                <span className="font-bold text-teal-700">{formatCurrency(weeklyTotal)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-200 border border-gray-200">
                <span className="font-medium">This month</span>
                <span className="font-bold text-teal-700">{formatCurrency(monthlyTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;