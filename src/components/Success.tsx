import { Alert, Container } from "react-bootstrap"
import { Link } from "react-router"

const Success = () => {
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
