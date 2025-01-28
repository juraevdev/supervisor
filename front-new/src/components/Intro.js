import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trackExpenseImage from "../assets/track-expense.jpg";
import organizeTasksImage from "../assets/organize-tasks.jpg";
import financialInsightsImage from "../assets/financial-insights.jpg";

const ExpenseIntro = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const navigate = useNavigate();

  const words = [
    "Welcome to Expense Manager!",
    "Track your daily expenses effectively.",
    "Gain insights into your weekly spending.",
    "Take control of your financial future.",
    "Organize your tasks and never miss a deadline.",
    "Experience a seamless way to manage your life.",
  ];

  // Typing effect logic
  useEffect(() => {
    if (currentWordIndex < words.length) {
      if (currentLine.length < words[currentWordIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + words[currentWordIndex][prev.length]);
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const lineTimeout = setTimeout(() => {
          setLines((prev) => [...prev, words[currentWordIndex]]);
          setCurrentLine("");
          setCurrentWordIndex((prev) => prev + 1);
        }, 1000);
        return () => clearTimeout(lineTimeout);
      }
    }
  }, [currentLine, currentWordIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
      {/* Skip Button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 right-4 bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        Skip
      </button>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center p-8 h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-5xl font-extrabold mb-6">Expense Manager</h1>
        <div className="text-lg space-y-4">
          {lines.map((line, index) => (
            <p key={index} className="animate-fadeIn text-white">
              {line}
            </p>
          ))}
          {currentLine && (
            <p className="animate-fadeIn">
              {currentLine}
              <span className="blinking-cursor text-white">|</span>
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/home/expense")}
          className="mt-8 bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white text-black text-center">
        <h2 className="text-4xl font-bold mb-8">Features of Expense Manager</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FeatureCard
            title="Track Expenses"
            image={trackExpenseImage}
            description="Analyze your daily, weekly, and monthly spending."
          />
          <FeatureCard
            title="Organize Tasks"
            image={organizeTasksImage}
            description="Plan and prioritize your daily tasks with ease."
          />
          <FeatureCard
            title="Financial Insights"
            image={financialInsightsImage}
            description="Get clear insights into your financial activities."
          />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-100 text-black text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <TestimonialCard
            name="Sarah Johnson"
            feedback="This app completely transformed the way I manage my expenses. Highly recommend!"
          />
          <TestimonialCard
            name="James Smith"
            feedback="A must-have tool for anyone looking to stay on top of their finances."
          />
          <TestimonialCard
            name="Emily Davis"
            feedback="The task organization feature is a game-changer for my daily routine."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Take Control?</h2>
        <p className="text-lg mb-8 text-white">
          Start your journey to better financial management and task organization today!
        </p>
        <button
          onClick={() => navigate("/todos")}
          className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
        >
          Explore Tasks
        </button>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, image, description }) => {
  return (
    <div className="max-w-xs bg-gray-100 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
      <img src={image} alt={title} className="w-20 h-20 mx-auto mb-4 bg-transparent" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-black">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, feedback }) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
      <p className="text-lg italic mb-4 text-black">"{feedback}"</p>
      <h4 className="text-xl font-bold">- {name}</h4>
    </div>
  );
};

export default ExpenseIntro;
