import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate("/login");
  };

  return (
    <div className="bg-dark-blue h-15">
      <button className="text-white" onClick={toggleModal}>
        Profile
      </button>

      {isModalOpen && (
        <div className="fixed top-10 flex flex-col justify-center items-center border-2 border-white rounded bg-dark-blue p-10"> 
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <button
            className="mt-3 bg-white text-dark-blue px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}