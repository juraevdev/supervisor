import { Link } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../utils/api";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

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
      };
      initializeUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/sign-in"); // Sign-in sahifasiga qayta yo'naltirish
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <header className="header">
      <div className="logo">Task & Spend</div>
      <nav className="nav">
        <Link to="/home/expense">Expenses</Link>
        <Link to="/todos">Tasks</Link>
        {!isAuthenticated ? (
          <Link to="/sign-in" className="sign-in">Sign in</Link>
        ) : (
          <div className="user-menu">
            <FaUserCircle
              size={30}
              style={{ cursor: "pointer" }}
              onClick={togglePopup}
            />
            {showPopup && (
              <div className="popup-menu">
                <Link to="/profile" className="popup-item">Profile</Link>
                <Link to="/request" className="popup-item">Change Password</Link>
                <button onClick={handleLogout} className="popup-item">Leave</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
