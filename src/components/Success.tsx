import { useEffect } from "react";
import { Alert, Container } from "react-bootstrap"
import { Link } from "react-router"
import { clearCart } from "../features/cartSlice";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

const Success = () => {
  const dispatch=useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  // In your Success.tsx page
useEffect(() => {
  const sessionId = new URLSearchParams(window.location.search).get('session_id');
  
  if (sessionId) {
    // Optionally verify with your backend
    fetch(`/api/payment/verify-session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Payment verified:', data);
      });
  }
    
  dispatch(clearCart());
    localStorage.setItem('cart','')
}, [dispatch]);

    
  return (
   <Container style={{marginTop:100}}>
    <Alert variant="success" className="text-center">
      Successfull Payment session Id :{sessionId}
    </Alert>
     <Link to="/products">Back To Product</Link>
    </Container>
   
  )
}

export default Success
