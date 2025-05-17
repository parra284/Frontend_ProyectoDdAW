import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { login } from "./authService";

export default function LogIn() {
  const navigate = useNavigate();  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      
      console.log('Login response:', response);
      
      // Make sure we have a valid token before storing it
      if (!response.accessToken) {
        throw new Error('No access token received from server');
      }
      
      localStorage.setItem('accessToken', response.accessToken);
      
      // Store user info including role in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      const role = response.user.role;
      
      if (role.toLowerCase() === 'pos') {
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