import React, { useState } from 'react'
import {OrderByDate} from '../../features/orderSlice'
import { useAppDispatch } from '../../app/hook'
import {type RootState } from '../../app/store';
import { useSelector } from 'react-redux';

import { Alert,Card, Button,Container, Row,Col,Spinner } from 'react-bootstrap';
import { formatters } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfOrderByDateReportComponent from './PdfOrderByDateReportComponent';
import { FaRegFilePdf } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
const OrderDates =  () => {
  const { t, i18n } = useTranslation("order");

const labels = {
  order: t("Order"),
  orderDate: t("Order_Date"),
  status: t("Status"),
  items: t("Items"),
  totalAmount: t("Total_Amount"),
};
const locale = i18n.language === "ar" ? "ar-SA" : i18n.language;
      const { loading, error, order } = useSelector((state: RootState) => state.orders);
        const dispatch=useAppDispatch()
        const today = new Date().toISOString().split("T")[0];
const [date, setDate] = useState(today);

           // const[date,setDate]=useState<string>('');
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
       dispatch(OrderByDate(date))
    }
  return (
    <>
     <Container>
      <Row>
        <Col>
          <h2 className='text-align-center offset-4 mb-5'>Order Reports By Date</h2>

        </Col>
     
      </Row>
      <Row>
        <Col>
           <form className='form-group col-md-6' onSubmit={handleSubmit} style={{display:"flex",flexGrow:"1",gap:"10px",alignItems:'center',justifyContent:'start'}}>
            <label className='form-label col-sm-3 mr-0'>Search by date</label><input  className='form-control md-3' type='date' value={date} onChange={(e:any)=>setDate(e.target.value)} />
            <Button className='col-md-2' size={"sm"} type='submit'><span><FaSearch /> {loading? "Searching": "Search"}</span></Button>
        </form>
 
        </Col>
       
      {error&&<span className="offset-4 mt-5 mb-5"><BiSolidError color='red' size={20} /> error </span>}
      </Row>
   
    
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
         <PDFDownloadLink className="btn btn-primary" style={{textDecoration:"none",marginBottom:"1.5rem"}}
                  document={<PdfOrderByDateReportComponent orders={order} labels={labels} locale={locale}/>}
                  fileName={`orders-report-${new Date().toISOString().split('T')[0]}.pdf`}
                >
                 <span><FaRegFilePdf />  
                {/* {({ loading }) =>
                    loading ? "Generating PDF..." : "Download Orders Report"
                  } */}
                  {loading ?("Generating..."):("Print PDF")}
                   
                     </span>
                </PDFDownloadLink> 
 <div style={{justifyContent:"start",flexDirection:"column",display:"flex",flexWrap:"wrap",gap:"10px"}}>
           {order.map((ord:any,index:number)=>(
           
         <Card key={index} style={{borderBottom:'1px solid gray',marginBottom:'10px',paddingBottom:'10px'}}>
              <Card.Header className='bg-white'><div style={{display:"flex",justifyContent:"space-between"}}><p><strong>Order ID:</strong> {ord.id}</p>   <p><strong>Order Date:</strong> {new Date(ord.createdAt).toLocaleDateString(i18n.language, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})}</p></div></Card.Header>
              <Card.Body>
              
                <div style={{justifyItems:"start"}}>
                  <table className='table table-borderless text-center' style={{width:'80%'}}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
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
                    </tbody>
                  </table>
                  
                </div>  
              </Card.Body>
              <Card.Footer className='bg-white'>
                <div style={{display:"flex",justifyContent:"space-between"}}> <span><strong>{`Order Total : ${formatters.currency(ord.totalAmount)}`}</strong></span></div>
                </Card.Footer>
              </Card>
              
           ))}
           </div>
        </Col>
       
      
      </Row>
    </Container>
   
  
) : (
    <Alert style={{display:'flex',width:'40%',justifyContent:'center',marginRight:'auto',marginLeft:'auto'}}> No Data</Alert>
)
    )}
   
   
   
   </>
    
  )
}

export default OrderDates
