import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";
import { fields } from "../utils/formFields";

export default function LogIn() {
  const navigate = useNavigate();

  const filteredFields = fields.filter(field => field.name !== "name" && field.name !== "lastName");

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/products')
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-login min-h-screen bg-cover bg-center">
      <AuthForm 
      onSubmit={onSubmit} 
      type="Log In"
      fields={filteredFields}
      message="Don't have an account?"
      link="signup"
      />
    </div>
  );
}