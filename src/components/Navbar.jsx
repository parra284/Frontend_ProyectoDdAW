import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../contexts/AuthContext';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg h-15 flex items-center justify-between px-4" role="navigation" aria-label="Main Navigation">
      <button
        className="text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white hover:text-gray-200"
        onClick={toggleModal}
        aria-expanded={isModalOpen}
        aria-controls="profile-modal"
      >
        Profile
      </button>

      {isModalOpen && (
        <div
          id="profile-modal"
          className="fixed top-10 flex flex-col justify-center items-center border-2 border-white rounded bg-gradient-to-r from-blue-500 to-purple-600 p-10 shadow-md"
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
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}