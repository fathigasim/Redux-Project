import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GetBasket,RemoveFromBasket} from '../features/basketSlice'
import {type RootState,type AppDispatch } from '../app/store'
import i18n from '../i18n'
const Basket = () => {
      
      const {items,error,loading} = useSelector((state: RootState) => state.basket)
      //const token = useSelector((state: RootState) => state.auth.token)
      const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
    
              try{
            dispatch(GetBasket());
            }
            catch(err:any){
                console.log(err)
            }
       
       

    },[dispatch])
    const total = items.reduce((sum:number, i:any) => sum + i.price * i.quantity, 0)

     console.log('Basket items:', total) // Debug
  return (
    <div style={{display:'flex',flexDirection:'column', maxWidth:"400px",margin:"auto",boxShadow:"5px 5px 10px rgba(0,0,0,0.5)",borderRadius:'1rem',padding:'1px'}} >
      {items&&
      <table className='table table-bordered' style={{justifyContent:'center'}}>
        <thead><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th></th></thead>
      {items.map((basket)=>(
         <tr key={basket.productId}>
        <td ><img src={basket.image} style={{width:'50px',height:'50px'}} className='img img-thumbnail' alt='default.png'/> </td><td>{basket.productName}</td><td>{basket.price}</td>
        <td>{basket.quantity}</td><td>
            <button className='btn btn-danger' onClick={()=>{dispatch(RemoveFromBasket({productId:basket.productId,quantity:1}))
         
        } }>remove</button></td>
      </tr>
      
      ))
      }
      </table>
    }
     <div className='alert alert-danger' style={{display:'flex',justifyContent:'center',height:'2rem',justifyItems:'center',padding:'2px'}}><p>Total:{new Intl.NumberFormat(i18n.language, {
                        style: "currency",
                        currency: "SAR",
                      }).format(total)}</p></div>
    </div>
  )
}

export default Basket
