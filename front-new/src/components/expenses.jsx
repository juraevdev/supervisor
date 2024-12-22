import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchOutcomes } from "../utils/api";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";
import './expence.css';

const Expense = () => {
    const [outcomes, setOutcomes] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchOutcomes().then(data => {
            if (data) {
                setOutcomes(data.outcomes || []); // outcomes massivini o'rnatish
                setTotal(data.total || 0); // total qiymatini o'rnatish
            } else {
                setOutcomes([]);
                setTotal(0);
            }
        });
    }, []);

    return (
        <div className="expense-summary">
            <h1>Today's expenses</h1>
            <h3>Total: {total} so'm</h3>
            <div className="expense-list">
                {outcomes.map(outcomes => (
                <div className="expense-item">
                    <div>
                    <h3>{outcomes.id}{outcomes.expense}</h3>
                    </div>
                    <span>{outcomes.amount}</span>
                </div>
                ))}
            </div>
            <div className="actions">
                <Link to='/add-expence'>add expense</Link>
            </div>
        </div>
    );
};

export default Expense