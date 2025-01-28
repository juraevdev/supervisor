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
      <div className="py-20 bg-white text-black text-center">
              <h2 className="text-4xl font-bold mb-8">Features of Task & Spend</h2>
              <div className="flex flex-wrap justify-center gap-8">
                <FeatureCard
                  title="Track Expenses"
                  image=""
                  description="Analyze your daily, weekly, and monthly spending."
                />
                <FeatureCard
                  title="Organize Tasks"
                  image=""
                  description="Plan and prioritize your daily tasks with ease."
                />
                <FeatureCard
                  title="Financial Insights"
                  image=""
                  description="Get clear insights into your financial activities."
                />
              </div>
            </div>
          </div>
        );
      };
      

      const FeatureCard = ({ title, image, description }) => {
        return (
          <div className="max-w-xs bg-gray-100 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-black">{description}</p>
          </div>
        );
      };

export default Home;
