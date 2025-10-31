import { useEffect, useState } from "react";
import { fetchAllOutcomes, deleteOutcome, UpdateOutcome } from "../utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Expenses = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedOutcome, setEditedOutcome] = useState({ expense: "", amount: "" });
  const [editingId, setEditingId] = useState(null);

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleOpenDialog = (outcome) => {
    setEditedOutcome({ expense: outcome.expense, amount: outcome.amount });
    setEditingId(outcome.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedOutcome({ expense: "", amount: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteOutcome(id);
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error deleting outcome:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await UpdateOutcome(editingId, editedOutcome);
      setRefresh((prev) => !prev);
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <Button asChild variant="ghost" className="text-gray-300 hover:bg-gray-800">
            <Link to="/home/expense" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/home/add-expense/">
              <Plus className="h-4 w-4" /> Add Expense
            </Link>
          </Button>
        </div>

        {/* Expenses Card */}
        <Card className="bg-gray-800 text-white border border-gray-700">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-xl sm:text-2xl font-bold">All Expenses</CardTitle>
            <p className="mt-2 sm:mt-0 text-lg">
              Total: <span className="font-bold">{formatCurrency(total)}</span>
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-full border-gray-700">
                <TableHeader>
                  <TableRow className="text-gray-300 border border-gray-700">
                    <TableHead className="font-medium">Expense</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="text-right font-medium">Amount</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outcomes.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gray-700 border-b border-gray-700">
                      <TableCell className="font-normal">{expense.expense}</TableCell>
                      <TableCell>{expense.day}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-400">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="cursor-pointer">
                            <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700 text-gray-200">
                            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer" onClick={() => handleOpenDialog(expense)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-red-500 hover:bg-gray-700 cursor-pointer">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Dialog */}
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
  );
};

export default Expenses;
