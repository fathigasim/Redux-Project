import { Alert, Container } from "react-bootstrap"
import { Link } from "react-router"
import { clearCart } from "../features/cartSlice";
import { useDispatch } from "react-redux";
const Success = () => {
  const dispatch=useDispatch();
  dispatch(clearCart());
    localStorage.setItem('cart','')
    
  return (
   <Container style={{marginTop:100}}>
    <Alert variant="success" className="text-center">
      Successfull Payment
    </Alert>
     <Link to="/products">Back To Product</Link>
    </Container>
   
  )
}

export default Success
