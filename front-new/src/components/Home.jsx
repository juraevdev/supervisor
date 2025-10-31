import React from "react";
import backgroundImage from "../assets/background.jpg";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">

      <section
        className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-8 w-80 md:w-4/5 mx-auto mt-4 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full md:w-1/2 h-[300px] md:h-[400px] flex flex-col justify-end items-start gap-3 p-6 md:p-8 rounded-2xl"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 text-white font-bold leading-tight dark:text-white">
            Welcome to Our Platform
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-6 max-w-xl dark:text-slate-800">
            Find the best solutions tailored to your needs.
          </p>
        </motion.div>
      </section>


      <section className="my-20 px-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-gray-800 hover:shadow-lg dark:hover:shadow-slate-700 transition-shadow p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[30%] max-w-sm">
            <h3 className="text-xl mb-1 dark:text-white">Smart Expense Tracking</h3>
            <p className="text-slate-500 dark:text-slate-400">Monitor and categorize your daily expenses with ease and accuracy.</p>
          </div>
          <div className="bg-gray-800 hover:shadow-lg dark:hover:shadow-slate-700 transition-shadow p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[30%] max-w-sm">
            <h3 className="text-xl mb-1 dark:text-white">Task Management</h3>
            <p className="text-slate-500 dark:text-slate-400">Organize your daily tasks and set priorities to stay productive.</p>
          </div>
          <div className="bg-gray-800 hover:shadow-lg dark:hover:shadow-slate-700 transition-shadow p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[30%] max-w-sm">
            <h3 className="text-xl mb-1 dark:text-white">Financial Insights</h3>
            <p className="text-slate-500 dark:text-slate-400">Gain valuable insights into your spending patterns and make smarter decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
