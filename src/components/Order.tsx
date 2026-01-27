import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSelector,useDispatch } from "react-redux";
import {type AppDispatch, type RootState } from "../app/store";
import {fetchOrders} from "../features/orderSlice"
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { setPage } from "../features/orderSlice";
import './styles.css'
import Paginationbootstrap from "./Paginationbootstrapold";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
const Order = () => {
    const { t } = useTranslation("order");
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
        <>
    <Container style={{marginTop:20}}>

      {loading &&<div>...Loading</div>}
        {error &&
            <p>{error}</p>}
        
          <div>
            <Row md={8} className="g-4">
            {order&&order.length >0 ?(
                   order.map((ord)=>(
                   
              <Card  key={ord.id} style={{boxShadow:' 5px 2px 2px black'}}>
                <>
                         <Row style={{marginTop:10,marginBottom:10,marginLeft:10}}>
                   <Col sm={12} md={6} lg={8}>
                 <strong>{t("Order_Date")}:{new Date(ord.createdAt).toLocaleDateString() }</strong>
         
                    <table className="col-md-6 mt-4 mb-4"> 
                   {ord.orderItems.map((item: any) => (
                       <tbody>
                        
                       <tr key={item.id}> 
                            <td >{t("Product")} {`:  ${item.name}`}</td>
                           
                     
                            <td>{t("Quantity")} {`:  ${item.quantity}`}</td>
                   

                            <td>{t("Price")} {`:  ${item.price}`}</td>
                    </tr>
                       
                     </tbody>
                    ))}
                    </table>
                     <strong>Total: {new Intl.NumberFormat(i18n.language, {
                                             style: "currency",
                                             currency: "SAR",
                                           }).format(ord.orderItems.reduce((sum, i:any) => sum + i.price * i.quantity, 0))}</strong>
                   </Col>
                     </Row>
                  
                      
                </>
                </Card>
           
                    
            )))
            :(
                <div>On Orders</div>
            )
           }
                 
                 
                 
              

            </Row>
          </div>
        
         {/* PAGINATION */}
      {/* {totalPages > 1 && (
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
      )} */}

    </Container>
    
              <Container fluid="md" className="mt-2 d-flex justify-content-center">
                <Paginationbootstrap
                  page={searchParams.has("page") ? Number(searchParams.get("page")) : 1 }
                  totalPages={totalPages}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              </Container>
              </>
  )
}

export default Order
