import { useEffect, useState } from 'react';
import './expence.css';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';


function AddExpense() {
    const navigate = useNavigate();
    const [expense, setExpense] = useState('');
    const [amount, setAmount] = useState('');
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
        <div>
            <h6>Add Expense</h6>
            <div className="form-group">
                <label>Expense</label>
                <input
                    type="text"
                    value={expense}
                    onChange={(e) => setExpense(e.target.value)}
                    className="expense"
                />
            </div>
            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="expense"
                />
            </div>
            <div className="button-group">
                <button onClick={() => navigate(-1)} className="button-back">Orqaga</button>
                <button onClick={addFunc} className="button-container">Add</button>
            </div>
        </div>
    );       
}

export default AddExpense;
