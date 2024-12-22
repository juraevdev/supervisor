import { Link } from 'react-router-dom'
import './Home.css'
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../utils/api';
function Header () {
     const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [username, setUsername] = useState("");
      useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
          setIsAuthenticated(true);
          const initializeUser = async () => {
            const userProfile = await fetchUserProfile();
            if (userProfile) {
              setUsername(userProfile.first_name || "User");
              localStorage.setItem("username", userProfile.first_name);
            } else {
              setIsAuthenticated(false);
            }
          }
          initializeUser();
        }
      }, []);

      
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username")
    setIsAuthenticated(false);
  };
     
    return (
        <header className="header">
        <div className="logo">Task & Spend</div>
        <nav className="nav">
          <Link to='/expence'>Expenses</Link>
          <a href="#">Tasks</a>
          {!isAuthenticated ? (
            <a href="sign-in" className="sign-in">Sign in</a>
          ) : (
            <div className="user-menu">
              <span>Welcome, {username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </nav>
      </header>
    )
}
export default Header