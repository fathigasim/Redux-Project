
import { useSelector, useDispatch } from 'react-redux'
import {type RootState } from '../app/store'
import { removeFromCart, clearCart } from '../features/cartSlice'
import api from '../api/axios'
import Container from 'react-bootstrap/Container'
import i18n from '../i18n'
import { Button } from 'react-bootstrap'
import { AiFillDelete as RemoveAiFillDelete } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { SiContactlesspayment } from "react-icons/si"


export default function Cart() {
  const { t } = useTranslation("cart");
  const items = useSelector((state: RootState) => state.cart.items)
  //const token = useSelector((state: RootState) => state.auth.token)
  const dispatch = useDispatch()

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleCheckout = async () => {
    try {
      const res = await api.post('/api/payment/create-checkout-session',items)
      window.location.href = res.data.url
    } catch (error:any) {
       if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        console.log("❌ 401 Unauthorized: User must log in again");
        
        // Redirect to login with redirect parameter
        window.location.href = `/logins?redirect=/cart`;
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
 console.log('Cart items:', items) // Debug
  return (
    <Container style={{marginTop:20,justifyContent:"center",alignItems:"center",fontFamily:'intel-one-mono-roboto'}}>
    <div>
      <h2>{t("Cart")}</h2>
      {items.length === 0 && <p>Cart is empty</p>}
      <div style={{display:"flex",flexDirection:"column",marginBottom:"1rem",gap:"1rem",width:"60%",margin:"auto"}}>
       <table >
      {items.map(i => (
       
          <tr key={i.id}>
          <td>{i.name}</td><td>{i.quantity}</td><td>{new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                      }).format(i.price * i.quantity)}</td><td><Button className='btn btn-danger' variant='red' onClick={() =>{ 
                        dispatch(removeFromCart(i.id))
                       
                        
                        }}><span> {t("Delete")} <RemoveAiFillDelete/></span></Button></td>
           
          </tr>
        
      ))}
      </table>
      </div>
      {items.length > 0 && (
        <>
        <div  style={{marginTop:'2rem',width:'48%',margin:'auto',display:'flex',flexWrap:'wrap',flexGrow:'1',flexDirection:'row',gap:"1rem",justifyContent:'space-between',padding:'0.5rem'}}>          <h3>Total: {new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                      }).format(total)}</h3>
                         <Button className='btn btn-info' onClick={handleCheckout}><span style={{justifyContent:'space-between',gap:'0.1rem'}}>{t("Checkout")}<SiContactlesspayment size={30} /></span></Button>
          <Button className='btn btn-danger' onClick={() => dispatch(clearCart())}><span style={{justifyContent:'space-between',gap:'0.1rem'}}>{t("Clear_Cart")}<RemoveAiFillDelete /></span></Button>
       
          </div>

        </>
      )}
    </div>
    </Container>
  )
}
