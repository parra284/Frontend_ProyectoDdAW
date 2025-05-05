import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      console.log(user);
      localStorage.setItem('token', user.accessToken);
      navigate('/products');
    } catch (error) {
      alert(error.message)
    }
    console.log(data);
  }

  return <AuthForm onSubmit={onSubmit} type="Log In"/>;
}