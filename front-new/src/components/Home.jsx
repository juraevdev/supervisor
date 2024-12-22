import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
 




  return (
    <div className="app-container">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Task & Spend: To-Do List and Expense Tracker</h1>
          <p>Manage your daily to-dos and track your expenses in one app</p>
        </div>
        <div className="hero-image">
          {/* <img src="" alt="Mobile App Preview" /> */}
        </div>
      </section>

      <section className="features">
        <h2>Features of Task & Spend</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>To-do List</h3>
            <p>Add tasks and manage your day</p>
          </div>
          <div className="card">
            <h3>Expense Tracker</h3>
            <p>Track your spending and categorize transactions</p>
          </div>
          <div className="card">
            <h3>Calendar</h3>
            <p>View your tasks and expenses on a calendar</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Follow us on Social Media</a>
        </div>
        <p>&copy; 2024 Task & Spend. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
