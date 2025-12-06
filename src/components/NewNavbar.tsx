import React, { useState } from 'react'
import './NewNavbar.css';
const NewNavbar = () => {
//   const [isCartOpen, setIsCartOpen] = useState(false);
  
//   const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
//     e.preventDefault();
//     setIsCartOpen(!isCartOpen);
//   };

 
  
  (function() {
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    cartElement.addEventListener("click", function() {
      const shoppingCart = document.querySelector(".shopping-cart") as HTMLElement;
      // This part emulates the fadeToggle behavior
      if (shoppingCart && (shoppingCart.style.display === "none" || shoppingCart.style.display === "")) {
        shoppingCart.style.display = "block"; // Or "flex", "grid", etc., depending on your CSS
        // For a true fade effect, you'd need to manipulate opacity and potentially use CSS transitions.
        // This example only toggles visibility.
      } else if (shoppingCart) {
        shoppingCart.style.display = "none";
      }
    });
  }
})();

  return (
    <>
  <nav>
  <div className="container">
    <ul className="navbar-left">
      <li><a href="#">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul> 

    <ul className="navbar-right">
      <li><a href="#" id="cart"><i className="fa fa-shopping-cart"></i> Cart <span className="badge">3</span></a></li>
    </ul> 
  </div>
</nav>


<div className="container">
  <div className="shopping-cart">
    <div className="shopping-cart-header">
      <i className="fa fa-shopping-cart cart-icon"></i><span className="badge">3</span>
      <div className="shopping-cart-total">
        <span className="lighter-text">Total:</span>
        <span className="main-color-text">$2,229.97</span>
      </div>
    </div> 

    <ul className="shopping-cart-items">
      <li className="clearfix">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/cart-item1.jpg" alt="item1" />
        <span className="item-name">Sony DSC-RX100M III</span>
        <span className="item-price">$849.99</span>
        <span className="item-quantity">Quantity: 01</span>
      </li>

      <li className="clearfix">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/cart-item2.jpg" alt="item1" />
        <span className="item-name">KS Automatic Mechanic...</span>
        <span className="item-price">$1,249.99</span>
        <span className="item-quantity">Quantity: 01</span>
      </li>

      <li className="clearfix">
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/cart-item3.jpg" alt="item1" />
        <span className="item-name">Kindle, 6" Glare-Free To...</span>
        <span className="item-price">$129.99</span>
        <span className="item-quantity">Quantity: 01</span>
      </li>
    </ul>

    <a href="#" className="button">Checkout</a>
  </div> 
</div> 
    </>
  )
}

export default NewNavbar
