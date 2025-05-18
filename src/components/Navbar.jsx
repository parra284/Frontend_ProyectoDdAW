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
    </nav>
  );
}