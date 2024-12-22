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
import AddExpence from './components/AddExpence';
import Layout from './components/Layout';



function App () {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/sign-in' element={<Login/>}/>
          <Route path='/sign-up' element={<Register/>}/>
          <Route path='/verify' element={<PasswordResetVerify/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/request' element={<PasswordResetRequest/>}/>
          <Route path='/resend' element={<ResendCode/>}/>
          <Route path='/register/verify' element={<RegisterVerify/>}/>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path='/expence' element={<Expense/>}/>
            <Route path='/add-expence' element={<AddExpence/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App