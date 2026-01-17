import React, { useState } from 'react'
import {OrderByDate} from '../../features/orderSlice'
import { useAppDispatch } from '../../app/hook'
import {type RootState } from '../../app/store';
import { useSelector } from 'react-redux';

import { Alert,Card, Button,Container, Row,Col,Spinner } from 'react-bootstrap';
import { formatters } from '../../utils/formatters';
import { Link } from 'react-router-dom';
const OrderDates =  () => {
      const { loading, error, order } = useSelector((state: RootState) => state.orders);
        const dispatch=useAppDispatch()
            const[date,setDate]=useState<string>('');
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
       dispatch(OrderByDate(date))
    }
  return (
    <>
     <Container>
      <Row>
        <Col>
          <Alert variant='primary'>Order Reports By Date</Alert>

        </Col>
     
      </Row>
      <Row>
        <Col>
           <form onSubmit={handleSubmit} style={{display:"flex",flexGrow:"1",gap:"10px",alignItems:'center',justifyContent:'start'}}>
            <span>Search by date</span><input type='date' value={date} onChange={(e:any)=>setDate(e.target.value)} />
            <Button size={"sm"} type='submit'>{loading? "Searching": "Search"}</Button>
        </form>
 
        </Col>
       
      
      </Row>
   
    {error&&<span>error </span>}
    </Container>
    {loading ? (
      <div style={{display:"flex",justifyContent:"center"}}>
      <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
    ) : (
        order.length>0 ? (
          <Container>
           <Row>
        <Col>
           {order.map((ord:any,index:number)=>(
         <Card key={index} style={{borderBottom:'1px solid gray',marginBottom:'10px',paddingBottom:'10px'}}>
              <Card.Header className='bg-white'><strong>Order ID:</strong> {ord.id}</Card.Header>
              <Card.Body>
                <p><strong>Order Date:</strong> {new Date(ord.createdAt).toLocaleDateString()}</p>
                <div style={{justifyContent:"end",justifyItems:"self-start",display:"flex"}}>
                  <table className='table table-borderless text-center' style={{width:'80%'}}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                  { ord.orderItems.map((item:any,idx:number)=>(
                    <tr key={idx} >
                      <td>
                        {item.name}</td>
                        <td>
                       {item.quantity}</td> 
                        <td>{item.price}</td>
                      <td>{`${formatters.currency(item.quantity*item.price)}`}</td>
                    </tr>
                  ))}
                  </table>
                  
                </div>  
              </Card.Body>
              <Card.Footer className='bg-white'>
                <div style={{display:"flex",justifyContent:"space-between"}}><Link to="/printOrderByDate">Print</Link> <span>{`Order Total : ${formatters.currency(ord.totalAmount)}`}</span></div>
                </Card.Footer>
              </Card>
           ))}
        </Col>
       
      
      </Row>
    </Container>
   
  
) : (
    <Alert style={{display:'flex',width:'80%',justifyContent:'center',marginRight:'auto',marginLeft:'auto'}}> No Data</Alert>
)
    )}
   
   
   
   </>
    
  )
}

export default OrderDates
