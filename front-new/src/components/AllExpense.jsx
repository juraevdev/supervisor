import { useEffect, useState } from "react"
import { fetchAllOutcomes, deleteOutcome, UpdateOutcome } from "../utils/api";
import {Button} from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MoreVertical, Plus } from "lucide-react"

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button></Button>
        <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Link href="/add-expense">
            <Plus className="h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardTitle className="text-2xl font-bold">All Expenses</CardTitle>
          <p className="text-lg">
            Total: <span className="font-bold">{formatCurrency(totalAmount)}</span>
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.expense}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(expense)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="expense">Expense Name</Label>
              <Input
                id="expense"
                value={editedExpense.expense}
                onChange={(e) => setEditedExpense({ ...editedExpense, expense: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={editedExpense.amount}
                onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default ModernExpenseTracker
