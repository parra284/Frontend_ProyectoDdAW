import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";

export default function LogIn() {
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate('/products');
  }

  return <AuthForm onSubmit={onSubmit} type="Log In"/>;
}