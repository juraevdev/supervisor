import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AddExpense() {
  const navigate = useNavigate();
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingUser, setLoadingUser] = useState(true);
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

const handleSubmit = () => {
    if (!expense || !amount) {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const today = new Date();
    const formattedDate = today.toISOString();

    const data = {
        user: user,
        day: formattedDate,
        expense: expense,
        amount: amount
    };

    const token = localStorage.getItem("access");

    axios.post(`${API_BASE_URL}/api/v1/expenses/outcome/`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log(response, "response from post request");
            setExpense('');
            setAmount('');
        })
        .catch(error => {
            console.log(error);
        });
}

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Button asChild variant="ghost" className="mb-6 text-emerald-400 hover:text-emerald-300">
          <Link to="/home/expense">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expenses
          </Link>
        </Button>

        <Card className="shadow-lg bg-gray-800">
          <CardHeader className="bg-emerald-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Add New Expense
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="expense" className="text-gray-300">Expense Name</Label>
                  <Input
                    id="expense"
                    placeholder="e.g., Groceries, Rent, etc."
                    value={expense}
                    onChange={(e) => setExpense(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring-gray-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-gray-300">Amount (UZS)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring-gray-600"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Expense'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
