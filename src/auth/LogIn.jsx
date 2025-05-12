import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";
import { jwtDecode } from "jwt-decode";

export default function LogIn() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      const user = localStorage.getItem('accessToken');
      const role = jwtDecode(user).role;
      console.log(role);
      if (role === 'POS') {
        navigate('/products');
      }
      else {
        navigate('/products/user');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-login min-h-screen bg-cover bg-center">
      <AuthForm onSubmit={onSubmit} type="Log In" />
    </div>
  );
}