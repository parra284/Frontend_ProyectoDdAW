import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "./AuthForm";
import fields from "../utils/AuthFormFields";
import { loginService } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const filteredFields = fields().filter(field => field.name !== "name" && field.name !== "lastName");

  const onSubmit = async (data) => {
    try {
      const response = await loginService(data);
      login(response.accessToken);
      navigate('/products');
    } catch (error) {
      alert(error.message)
    }
  }

  return <AuthForm
  onSubmit={onSubmit} 
  type="login"
  fields={filteredFields}
  message="Don't have an account?"
  />;
}