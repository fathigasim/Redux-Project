
import {useState,useEffect} from 'react'
import { Link } from 'react-router';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useDispatch } from 'react-redux';
import { useSearchParams } from "react-router";
import { AppDispatch   } from "../app/store";
import { BasketRemove } from "../features/basketSlice"
import { ListGroup } from 'react-bootstrap';

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
  // const dispatch=useDispatch();
  
  const dispatch=useDispatch<AppDispatch>();

const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
   const orderRef = searchParams.get('order_ref');
  useEffect(() => {
    const verifyPayment = async () => {
   

      if (!orderRef) {
        setError('Order reference not found');
        setLoading(false);
        return;
      }

      try {
        
        const response = await api.get(
          `/payment/order/${orderRef}`
        );

        if (response.status !== 200) {
          throw new Error('Failed to fetch order status');
        }
             console.log('Payment verification response:', response.data);
       // const data = await response.json();
        setOrderStatus(response.data);
       try {
  await dispatch(BasketRemove()).unwrap();
  console.log("basket removed successfully");
} catch (err: any) {
  console.error("failed to remove basket", err);
}

    localStorage.setItem('cart','')
        // // Clear pending order
        // sessionStorage.removeItem('pendingOrderRef');
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  setTimeout(() => verifyPayment(), 2000);
  }, [searchParams, dispatch]);

  if (loading) {
    return (
      <div style={{display:"flex",justifyContent:"center"}}>
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
        // Outer container for full-page centering
    <div className="min-h-screen bg-gray-50 flex items-center justify-center  p-4">
      
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="p-8 text-center mt-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce-slow">
            <CheckCircle className="w-10 h-10 text-green-600 bg-green-100" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500">Thank you for your purchase.</p>
        </div>

        {/* Order Details Section */}
        {orderStatus && (
          <div style={{display:"flex",justifyContent:"center"}} className="px-8 pb-8">
           <div
  style={{
    maxWidth: "500px",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "stretch"
  }}
  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
>

              <ListGroup variant='flush'>
      <ListGroup.Item className="border-bottom-0">Order Ref {`: ${orderStatus.orderReference}`}</ListGroup.Item>
      <ListGroup.Item className="border-bottom-0">Status {`: ${orderStatus.status}`}</ListGroup.Item>
      <ListGroup.Item className="border-bottom-0">Total Amount {`: ${orderStatus.totalAmount} SAR`}</ListGroup.Item>
 
    </ListGroup>
        <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price (SAR)</th>
              </tr>
            </thead>
            <tbody>
              {orderStatus.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-left">{item.name}</td>
                  <td className="px-4 py-2 text-left">{item.quantity}</td>
                  <td className="px-4 py-2 text-left">{item.price * item.quantity} SAR</td>
                </tr>
              ))}
            </tbody>
          </table>

              

              
            </div>
          </div>
        )}

        {/* Footer / Action Section */}
        <div className="px-8 pb-8">
          <p className="text-center text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your inbox.
          </p>

          <Link 
            to="/products"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success
