import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar( { buttons }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('shoppingCart');
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-dark-blue h-15 flex items-center justify-between px-4 z-50" 
    role="navigation" aria-label="Main Navigation">
      {buttons && buttons.length > 0 && (
        <div>
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`text-white font-semibold hover:text-gray-200 m-5 hover:cursor-pointer ${
                location.pathname === button.path ? "underline" : ""
              }`} // Add underline if selected
              onClick={button.action}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
      <button
        className="text-white font-semibold hover:text-gray-200 hover:cursor-pointer m-5"
        onClick={toggleModal}
        aria-expanded={isModalOpen}
        aria-controls="profile-modal"
      >
        Profile
      </button>

      {isModalOpen && (
        <div
          id="profile-modal"
          className="absolute right-5 top-16 bg-white text-black rounded shadow-lg py-2 w-48"
          role="menu"
          aria-labelledby="profile-title"
        >
          <div className="px-4 py-2 text-sm font-medium border-b border-gray-200">
            <h2 id="profile-title">Profile</h2>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            role="menuitem"
          >
            Log Out
          </button>
        </div>
      )}

    </div>
  );
}