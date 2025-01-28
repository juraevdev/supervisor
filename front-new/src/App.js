import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PasswordResetVerify from './components/PasswordResetVerify';
import Reset from './components/Reset';
import PasswordResetRequest from './components/PasswordResetRequest';
import ResendCode from './components/ResendCode';
import Home from './components/Home';
import RegisterVerify from './components/RegisterVerify';
import Expense from './components/Expense';
import AddExpense from './components/AddExpense';
import Layout from './components/Layout';
import ProfileDetails from './components/UserProfile';
import Outcomes from './components/AllExpense';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import ExpenseIntro from './components/Intro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ExpenseIntro />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/verify" element={<PasswordResetVerify />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/request" element={<PasswordResetRequest />} />
        <Route path="/resend" element={<ResendCode />} />
        <Route path="/register/verify" element={<RegisterVerify />} />

        {/* Protected Routes (Layout serves as a wrapper for authenticated pages) */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="expense" element={<Expense />} />
          <Route path="add-expense" element={<AddExpense />} />
        </Route>

        {/* Profile and Other Features */}
        <Route path="/profile" element={<ProfileDetails />} />
        <Route path="/expenses" element={<Outcomes />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/add-todo" element={<AddTodo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
