
import { useSelector, useDispatch } from 'react-redux'
import {type RootState } from '../app/store'
import { removeFromCart, clearCart } from '../features/cartSlice'
import api from '../api/axios'
import Container from 'react-bootstrap/Container'
export default function Cart() {
  const items = useSelector((state: RootState) => state.cart.items)
  //const token = useSelector((state: RootState) => state.auth.token)
  const dispatch = useDispatch()

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const handleCheckout = async () => {
    try {
      const res = await api.post('/payment/create-checkout-session',items)
      window.location.href = res.data.url
    } catch (error) {
      console.error(error)
      alert('Checkout failed')
    }
  }
 console.log('Cart items:', items) // Debug
  return (
    <Container style={{marginTop:100,justifyContent:"center",alignItems:"center"}}>
    <div>
      <h2>Cart</h2>
      {items.length === 0 && <p>Cart is empty</p>}
      {items.map(i => (
        <div key={i.id}>
          {i.name} x {i.quantity} = ${i.price * i.quantity}
          <button onClick={() => dispatch(removeFromCart(i.id))}>Remove</button>
        </div>
      ))}
      {items.length > 0 && (
        <>
          <h3>Total: ${total}</h3>
          <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
    </Container>
  )
}
