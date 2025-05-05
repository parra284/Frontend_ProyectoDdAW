import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/products');
    } catch (error) {
      alert(error.message)
    }
  }

  return <AuthForm onSubmit={onSubmit} type="Log In"/>;
}