import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import {type AppDispatch, type RootState } from "../app/store";
import {fetchOrders} from "../features/orderSlice"
import { Card, Container } from "react-bootstrap";
import './styles.css'
const Order = () => {
    
      const { loading, error, order } = useSelector((state: RootState) => state.orders);
     const dispatch=useDispatch<AppDispatch>();
   useEffect(() => {
     dispatch(fetchOrders());
   }, [dispatch]);
   
      return (
    <Container style={{marginTop:100}}>
      {loading &&<div>...Loading</div>}
        {error &&
            <p>{error}</p>}
        
          <div className="maindiv" style={{display:"flex",top:"5px"}}>
            {order&&order.length >0 ?(
                   order.map((ord)=>(
              <Card key={ord.id} style={{width:"300px" ,padding:15,margin:10,boxShadow:' 5px 2px 2px black',flexWrap:"wrap",gap:"20px",justifyContent:"center"}}>
                <>
                 <strong>Order Date:{new Date(ord.orderDate).toLocaleDateString() }</strong>
                   {ord.orderItems.map((item: any) => (
                        <table key={item.id} >
                            
                            <td style={{width:"50%"}}>{item.name}</td>
                            <td style={{width:"25%"}}>{item.quantity}</td>
                            <td style={{width:"25%"}}>{item.price}</td>
                        </table>
                    ))}
                   <strong>Total: {ord.orderItems.reduce((sum, i:any) => sum + i.price * i.quantity, 0)}</strong>
                      
                </>
                </Card>
            )))
            :(
                <div>On Orders</div>
            )
           }
                 
                 
                 
              

            
          </div>
        
      
    </Container>
  )
}

export default Order
