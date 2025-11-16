import React, { useState } from 'react'
import {OrderByDate} from '../../features/orderSlice'
import { useAppDispatch } from '../../app/hooks'
import {type RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { Alert,Card,CardBody,CardHeader,CardFooter, Button } from 'react-bootstrap';
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
   <div style={{marginTop:'100px'}}>
    {error&&<span>error </span>}
    <div style={{display:'flex',flexWrap:"wrap",flexDirection:'row',width:'80%',marginLeft:'auto',marginRight:'auto',marginBottom:'20px',padding:'10px'}}>
        <form onSubmit={handleSubmit} style={{display:"flex",flexGrow:"1",gap:"10px",alignItems:'center',justifyContent:'start'}}>
            <span>Search by date</span><input type='date' value={date} onChange={(e:any)=>setDate(e.target.value)} />
            <Button size={"sm"} type='submit'>{loading? "Searching": "Search"}</Button>
        </form>
 
          </div>
    </div>
    {
        order.length>0 ?(
        <div style={{display:'flex',flexDirection:'column',width:'80%',marginLeft:'auto',marginRight:'auto',marginBottom:'50px'}}>
        <Accordion style={{flex:"1"}}>
          <div >
      <Accordion.Item eventKey="0">
        
        <Accordion.Header>Order Details</Accordion.Header>
        <Accordion.Body>
          <>
          {order.map((ord:any,index:number)=>(
            <>
            <div key={index} style={{borderBottom:'1px solid gray',marginBottom:'10px',paddingBottom:'10px'}}>
              <p><strong>Order ID:</strong> {ord.id}</p>
              <p><strong>Order Date:</strong> {new Date(ord.orderDate).toLocaleDateString()}</p>
              <div style={{justifyContent:"end",justifyItems:"self-start",display:"flex"}}>
              <Button >Print</Button>
             </div>
              </div>
             
                <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',gap:'20px'}}>
                  
                 { ord.orderItems.map((item:any,idx:number)=>(
                  <Card key={idx} style={{marginLeft:'20px',marginBottom:'5px'}}>
                
                  <CardHeader><strong>Product:</strong> {item.name}</CardHeader>
                  <CardBody><table><td><strong>Quantity:</strong> {item.quantity}</td> <td><strong>Price:</strong> {item.price}</td></table></CardBody>
                  <CardFooter>{`Total : ${item.quantity*item.price}`}</CardFooter>
                
                  </Card>
                ))
                
                  }
                
                 
                </div>
              
                <div>
                   <Alert variant='info'><span>{`Order Number ${ord.id} Total Is`}</span> <span>{ord.orderItems.reduce((sum:number,i:any)=> sum+i.quantity*i.price,0)}</span></Alert>
                </div>
                
            
        
              </>
            ))}
                  </>
        </Accordion.Body>

      </Accordion.Item>
             </div>
    </Accordion>
    </div>
):(
    <Alert style={{display:'flex',width:'80%',justifyContent:'center',marginRight:'auto',marginLeft:'auto'}}> No Data</Alert>
)
    }
   
   
   </>
    
  )
}

export default OrderDates
