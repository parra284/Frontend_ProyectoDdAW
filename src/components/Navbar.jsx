import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ buttons, userRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('shoppingCart');
  };

  const handleButtonClick = (button) => {
    navigate(button.path)
  };

  const filteredButtons = buttons.filter((button) => {
    if (userRole === 'POS') return button.roles.includes('POS');
    if (userRole === 'user') return button.roles.includes('user');
    return false;
  });

  return (    <nav className="bg-primary h-15 flex items-center justify-between px-4" role="navigation" aria-label="Main Navigation">
      <div className="flex items-center">
        <button
          className="text-white font-bebas hover:text-tertiary m-5 lg:hidden"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <div className={`lg:flex ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          {filteredButtons.map((button, index) => (
            <button
              key={index}
              className={`text-white font-bebas text-lg hover:text-tertiary m-5 hover:cursor-pointer ${
                location.pathname === button.path ? "underline" : ""
              }`}
              onClick={() => handleButtonClick(button)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <button
        className="text-white font-bebas hover:text-tertiary hover:cursor-pointer m-5"
        onClick={toggleModal}
        aria-expanded={isModalOpen}
        aria-controls="profile-modal"
      >
        Profile
      </button>

      {isModalOpen && (
        <div
          id="profile-modal"
          className="fixed top-10 end-5 flex flex-col justify-center items-center border-2 border-white rounded bg-gradient-to-r from-blue-500 to-dark-blue p-10 shadow-md"
          role="dialog"
          aria-labelledby="profile-title"
          aria-describedby="profile-description"
        >
          <h2 id="profile-title" className="text-lg font-bold text-white">
            Profile
          </h2>
          <p id="profile-description" className="text-sm text-gray-300">
            Manage your account settings here.
          </p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md hover:cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}