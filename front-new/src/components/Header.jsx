import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../utils/api";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
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
    navigate("/login");
  };

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <header className="w-full dark:bg-gray-950 text-gray-800 dark:text-white shadow-md px-4 py-3 flex justify-between items-center relative z-50">
      <div className="text-xl font-bold">Task & Spend</div>
      <nav className="flex flex-row md:flex gap-6 items-center">
        <Link to="/home/expense" className="text-white no-underline hover:text-blue-500">Expenses</Link>
        <Link to="/home/todo" className="text-white no-underline hover:text-blue-500">Tasks</Link>
        {!isAuthenticated ? (
          <Link to="/login" className="text-white no-underline hover:text-blue-500">Sign in</Link>
        ) : (
          <div className="relative">
            <FaUserCircle size={30} className="cursor-pointer" onClick={togglePopup} />
            {showPopup && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                <Link to="/home/profile" className="block px-4 py-2 no-underline text-white dark:hover:bg-gray-500">Profile</Link>
                <Link to="/request" className="block px-4 py-2 no-underline text-white dark:hover:bg-gray-500">Change Password</Link>
                <button onClick={handleLogout} className="w-full text-left text-white px-4 py-2 dark:hover:bg-gray-500 cursor-pointer">Leave</button>
              </div>
            )}
          </div>
        )}
      </nav>

    </header>
  );
}

export default Header;
