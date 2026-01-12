import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {type RootState } from '../../app/store';
import { useAppDispatch } from '../../app/hook';
import { useSelector } from 'react-redux';
import { setPage } from '../../features/orderstatSlice';
import { fetchOrderStats } from '../../features/orderstatSlice';
import Accordion from 'react-bootstrap/Accordion';
import { Container } from 'react-bootstrap';

import CustomPagination from '../CustomPagination';
import styles from './OrderTotals.module.css';



const OrderTotals = () => {
     const { loading, error, items,page,totalCount,pageSize, } = useSelector((state: RootState) => state.orderstats);
         const [searchParams, setSearchParams] = useSearchParams();
    const dispatch=useAppDispatch();
  // Get page from URL params
  const currentPage = Number(searchParams.get("page")) || 1;
    useEffect(()=>{
      // const pageParam = Number(searchParams.get("page")) || 1;
        dispatch(setPage(currentPage));
   dispatch(fetchOrderStats({ page : currentPage }));

    },[searchParams,dispatch])
    
    const totalPages = Math.ceil(totalCount / pageSize);
    console.log("OrderTotals -> result", totalPages);
     return (
    <>



    <Container  className={styles.container}>
      {error ? (
        <span className={styles.errorMessage}>{error}</span>
      ) : (
        <>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              <div>
                {items && items.length > 0 ? (
                  <div>
                    {items.map((order: any, index: number) => (
                      <Accordion key={index} className={styles.accordion}>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <div className={styles.orderHeader}>
                              <span className={styles.orderInfo}>
                                <strong>Order No:</strong> {order.orderId}
                              </span>
                              <span className={styles.orderInfo}>
                                <strong>Product:</strong> {order.product}
                              </span>
                              <span className={styles.orderInfo}>
                                <strong>Total:</strong> {order.total}
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <table className={`table ${styles.table}`}>
                              <tbody>
              {order.items.map((item:any, idx:number)=>(
                <tr key={idx}>
                  <td>{item.productName}</td>
                  <td>{item.productQuantity}</td>
                  <td>{item.productPrice}</td>
                </tr>
              ))}
             </tbody>
                            </table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noData}>No data available</div>
                )}
                
   <CustomPagination
          totalPages={totalPages}
        page={currentPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams} ></CustomPagination>
              </div>
            </>
          )}
        </>
      )}
    </Container>
  
    {/* <Container>
    {error ? (<span style={{color:'red'}}>{error}</span>):(
     <>
        {loading ?(<div>...Loading</div>)
        :(
        <>
        <div>
              {items&&items.length>0 ?(<div>
                <ul>
                   { items.map((order:any,index)=>(
                   <Accordion key={index} 
                  //  defaultActiveKey="0"
                   >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
  <div
    className="d-flex flex-wrap justify-content-between align-items-center w-100"
    style={{ gap: "0.5rem" }}
  >
    <span><strong>Order No:</strong> {order.orderId}</span>
    <span><strong>Product:</strong> {order.product}</span>
    <span><strong>Total:</strong> {order.total}</span>
  </div>
</Accordion.Header>

        <Accordion.Body>
          <table className="table">
             <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
             </thead>
             <tbody>
              {order.items.map((item:any, idx:number)=>(
                <tr key={idx}>
                  <td>{item.productName}</td>
                  <td>{item.productQuantity}</td>
                  <td>{item.productPrice}</td>
                </tr>
              ))}
             </tbody>
          </table>
        </Accordion.Body>
      </Accordion.Item>
   
    </Accordion>

                   ))

                   }
                   </ul>
                 </div>
                 
                
                ):
              (<div>no data available </div>)}
        </div>
        
    

   <CustomPagination
          totalPages={totalPages}
        page={currentPage}
        setSearchParams={setSearchParams}
        searchParams={searchParams} ></CustomPagination>
        </>
        )}
        </>
    )}
      
        </Container> */}
      </>
  )
}

export default OrderTotals
