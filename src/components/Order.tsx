import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useSelector,useDispatch } from "react-redux";
import {type AppDispatch, type RootState } from "../app/store";
import {fetchOrders} from "../features/orderSlice"
import { Card, Container } from "react-bootstrap";
import { setPage } from "../features/orderSlice";
import './styles.css'
const Order = () => {
   // const [currentPage, setCurrentPage] = useState<number>(1);
      const { loading, error, order,page,pageSize,totalCount } = useSelector((state: RootState) => state.orders);
      const [searchParams, setSearchParams] = useSearchParams();
      const dispatch=useDispatch<AppDispatch>();
   useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
     dispatch(fetchOrders({ page : pageParam }));
     dispatch(setPage(pageParam));
   }, [searchParams,dispatch]);
     const totalPages = Math.ceil(totalCount / pageSize);
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
        
         {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                className={`page-btn ${page === num ? "active" : ""}`}
                //  onClick={() => dispatch(setPage(num))}
                onClick={() => {
  const params = {
    ...Object.fromEntries(searchParams),
    page: num.toString(),
  };
  setSearchParams(params);
}}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}
    </Container>
  )
}

export default Order
