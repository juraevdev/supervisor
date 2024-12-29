import { useEffect, useState } from 'react';
import './expence.css';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

function AddExpence() {
    const [expense, setExpense] = useState(null);
    const [amount, setAmount] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");
        axios.get(API_BASE_URL + '/api/v1/accounts/profile/', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            console.log(response, "me data");
            setUser(response?.data?.first_name);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    function addFunc() {
        if (!expense || !amount) {
            alert("Maydonlarni to'dirishing kerak");
        } else {
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
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    return (
        <div>
          <h1>Add Expense</h1>
            <div>
              <label>Expense</label>
              <input
                type="text"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button type="submit" onClick={addFunc}>Add</button>
        </div>
      );
    };




    
export default AddExpence;
