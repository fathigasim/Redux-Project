import React, { useState } from 'react'
import {OrderByDate} from '../../features/orderSlice'
import { useAppDispatch } from '../../app/hooks'
import {type RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import { Alert } from 'react-bootstrap';
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
        <form onSubmit={handleSubmit}>
            <span>Search by date</span><input type='date' value={date} onChange={(e:any)=>setDate(e.target.value)} />
            <button type='submit'>Search</button>
        </form>
 
          
    </div>
    {
        order.length>0 ?(
        <div style={{width:'60%',marginLeft:'auto',marginRight:'auto'}}>
        <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </div>
):(
    <Alert> No Data</Alert>
)
    }
   
   
   </>
    
  )
}

export default OrderDates
