import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getButtons } from '../utils/buttonsPOS';

export default function Orders() {
  const navigate = useNavigate();
  const buttons = getButtons(navigate);

  return(
    <Navbar 
    buttons={buttons}
    />
  )
}