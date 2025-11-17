// import { useEffect } from "react";
// import { Alert, Container } from "react-bootstrap"
// import { Link } from "react-router"
// import { clearCart } from "../features/cartSlice";
// import { useDispatch } from "react-redux";
// import { useSearchParams } from "react-router";

// const Success = () => {
//   const dispatch=useDispatch();
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get('session_id');
//   // In your Success.tsx page
// useEffect(() => {
//   const sessionId = new URLSearchParams(window.location.search).get('session_id');
  
//   if (sessionId) {
//     // Optionally verify with your backend
//     fetch(`/api/payment/verify-session/${sessionId}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log('Payment verified:', data);
//       });
//   }
    
//   dispatch(clearCart());
//     localStorage.setItem('cart','')
// }, [dispatch]);

    
//   return (
//    <Container style={{marginTop:100}}>
//     <Alert variant="success" className="text-center">
//       Successfull Payment session Id :{sessionId}
//     </Alert>
//      <Link to="/products">Back To Product</Link>
//     </Container>
   
//   )
// }

// export default Success
import {useState,useEffect} from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
 import { clearCart } from "../features/cartSlice";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};
interface OrderStatus {
  orderReference: string;
  status: string;
  totalAmount: number;
  items?: OrderItem[];
}
const Success = () => {
  const dispatch=useDispatch();
  
  

const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      // Get session_id from URL
      // const urlParams = new URLSearchParams(window.location.search).get('session_id');
      // const sessionId = urlParams;
      const sessionId = searchParams.get('session_id');
      const orderRef = searchParams.get('order_ref');
      // Get order reference from storage
      //const orderRef = sessionStorage.getItem('pendingOrderRef');

      if (!orderRef) {
        setError('Order reference not found');
        setLoading(false);
        return;
      }

      try {
       // const token = localStorage.getItem('authToken');
        
        const response = await api.get(
          `/api/payment/order/${orderRef}`
        );

        if (response.status !== 200) {
          throw new Error('Failed to fetch order status');
        }
             console.log('Payment verification response:', response.data);
       // const data = await response.json();
        setOrderStatus(response.data);
          dispatch(clearCart());
    localStorage.setItem('cart','')
        // // Clear pending order
        // sessionStorage.removeItem('pendingOrderRef');
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg">
        <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-center text-red-800 mb-2">Error</h2>
        <p className="text-center text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-center mb-4">Payment Successful!</h2>
      
      {orderStatus && (
        <div className="space-y-3 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Order Reference</p>
            <p className="font-mono font-bold">{orderStatus.orderReference}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-green-600">{orderStatus.status}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-bold text-xl">{orderStatus.totalAmount} SAR</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Order Items:</h3>
            <div className="space-y-2">
              {orderStatus.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">{item.price * item.quantity} SAR</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-gray-600 mb-6">
        A confirmation email has been sent to your email address.
      </p>

      <button
        onClick={() => window.location.href = '/'}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default Success
