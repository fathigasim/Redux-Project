
import { useSelector, useDispatch } from 'react-redux'
import {type basketRemove ,GetBasket,RemoveFromBasket,ClearBasket} from '../features/basketSlice'
import {type RootState,type AppDispatch } from '../app/store'
import i18n from '../i18n'
import { toast } from 'react-toastify'
import { FaInfoCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { Alert, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import Contrainer from 'react-bootstrap/Container'
const Basket = () => {
      const { t } = useTranslation("basket");
      const {loading} = useSelector((state: RootState) => state.basket)
     const { items } = useSelector((state: RootState) => state.basket) || {};
      const { user, accessToken } = useSelector((state: RootState) => state.auth);
       const isLoggedIn = Boolean(user && accessToken);
      const dispatch = useDispatch<AppDispatch>()
  
     const RemoveItemFromBasket = async({productId,quantity}:basketRemove)=>{
           try{
            await dispatch(RemoveFromBasket({productId,quantity}))
  await dispatch(GetBasket()).unwrap(); 
           }
        catch(err:any){
          console.log(err)
        }
     }
      // const clearTheBasket = async()=>{
      //     try{
      //          await dispatch(ClearBasket()).unwrap();
                  
      //          toast.success("basketItems deleted")
                    
        
      //     }
      //     catch(err:any){
      //            alert(err)
      //     }
      // }
  const handleCheckout = async () => {
    
    try {
      const res = await api.post('/payment/create-checkout-session',items)
      window.location.href = res.data.url
    } catch (error:any) {
       if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        if(!isLoggedIn ){
        console.log("❌ 401 Unauthorized: User must log in again");
        toast.error("User must log in to proceed to checkout");
         window.location.href = `/logins?redirect=/basket`;
    return;
        }
        // Redirect to login with redirect parameter
        window.location.href = `/logins?redirect=/basket`;
        return;
      }

      console.error("Server Error:", error.response.data);
    } else {
      // Network error or no response
      console.error("Network/Unknown Error:", error);
    }

    alert("Checkout failed");
  
    }
  }
         const safeItems = Array.isArray(items) ? items : [];
    const total = safeItems.reduce((sum:number, i:any) => sum + i.price * i.quantity, 0)


    if(loading){
        return <div>{t("loading")}</div>
    }
  return (
    <>
    
 
    {items.length !==0 && 
    <>
     
    <Contrainer className='neucha-regular border rounded p-3 mt-3' style={{boxShadow:"5px 5px 10px rgba(0,0,0,0.5)"}}>
      <Row>
        <Col md={8} sm={12} style={{margin:'auto'}}> 
    {/* style={{display:'flex',flexDirection:'column', maxWidth:"400px",margin:"auto",boxShadow:"5px 5px 10px rgba(0,0,0,0.5)",borderRadius:'1rem',padding:'3px'}}  */}
    
       {isLoggedIn ? null : <Alert variant="danger"><span><FaInfoCircle /> {t("login_first")}</span></Alert>}
      {items&&
      
      <table className='table table-borderless text-center' style={{justifyContent:'center'}}>
        <thead><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th></th></thead>
        <tbody>
      {items.map((basket)=>(
     
         <tr key={basket.productId}>
        <td ><img src={basket.image} style={{width:'50px',height:'50px'}} className='img img-thumbnail' alt='default.png'/> </td><td>{basket.productName}</td><td>{basket.price}</td>
        <td>{basket.quantity}</td><td>
            <button style={{boxShadow:"5px 5px 10px rgba(0,0,0,0.5)"}} className='btn btn-danger' onClick={()=>{
              RemoveItemFromBasket({productId:basket.productId,quantity:1})}
              }><span><MdDeleteForever /> {t("remove")}</span></button></td>
      </tr>
      
      ))
      }
         </tbody>
      </table>
      
    }
     <div className='alert alert-danger' style={{display:'flex',justifyContent:'center',height:'2rem',justifyItems:'center',padding:'2px'}}><p>Total:{new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                      }).format(total)}</p>
                      </div>
                       <div className='' style={{display:'flex',justifyContent:'space-around',minHeight:'2rem',gap:'8rem',padding:'1px'}}>
        <div style={{zIndex:'100',justifyItems:'stretch'}}>  <button className='btn btn-danger rounded-pill' onClick={async ()=>{
          const confirmation=window.confirm('Are you sure you want to delete');
          if(confirmation){
            try{
         await dispatch(ClearBasket()).unwrap();
         toast.success("Basket Cleared")
            }
            catch(err:any){
               toast.error(err || "Failed to clear basket");
            }
          }
        }}
          ><span><MdDeleteForever /> {t("remove_basket")}</span></button></div>
           <div style={{justifyItems:'end'}} >
            <button 
            style={{boxShadow:"5px 5px 10px rgba(0,0,0,0.5)"}}
             disabled={!isLoggedIn}
             className='btn btn-primary rounded-pill' onClick={()=>handleCheckout()}><span><FaRegMoneyBillAlt className='mr-2'/> {t("Pay")}</span></button></div>
    </div>
    </Col>
    </Row>
    </Contrainer>

   </>
}
    </>
  )
}

export default Basket
