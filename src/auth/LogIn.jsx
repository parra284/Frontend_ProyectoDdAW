import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      const role = response.user.role;
      
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