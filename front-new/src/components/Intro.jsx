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

  // Typing effect
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
    <div className="min-h-screen bg-gray-900 text-white relative">
      <button
        onClick={() => navigate("/home")}
        className="cursor-pointer absolute top-4 right-4 bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        Skip
      </button>

      <div className="flex flex-col items-center justify-center text-center px-4 py-12 md:py-24 min-h-screen ...">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
          Expense Manager
        </h1>
        <div className="text-base sm:text-lg space-y-4">
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
          className="cursor-pointer mt-8 bg-white text-blue-500 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 lg:px-16 xl:px-24 bg-gray-900 text-white text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Features of Expense Manager</h2>
        <div className="flex flex-wrap justify-center gap-6">
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
      <div className="py-16 px-4 bg-gray-900 text-black text-center">
        <h2 className="text-2xl text-white sm:text-3xl font-bold mb-6">What Our Users Say</h2>
        <div className="flex flex-wrap justify-center gap-6">
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
      <div className="py-16 px-4 bg-gray-900 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Ready to Take Control?</h2>
        <p className="text-base sm:text-lg mb-8 text-white">
          Start your journey to better financial management and task organization today!
        </p>
        <button
          onClick={() => navigate("/todos")}
          className="cursor-pointer w-full sm:w-auto bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
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
    <div className="w-full sm:w-[90%] md:w-[45%] lg:w-[30%] bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
      <img src={image} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4" />

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white">{description}</p>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, feedback }) => {
  return (
    <div className="w-full sm:w-[90%] md:w-[45%] lg:w-[30%] bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
      <p className="text-lg italic mb-4 text-white">"{feedback}"</p>
      <h4 className="text-xl font-bold text-white">- {name}</h4>
    </div>
  );
};

export default ExpenseIntro;
