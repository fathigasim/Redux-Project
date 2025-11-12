import React from 'react'
import { Navbar, Nav, Form, Button, Container, Dropdown,Badge } from 'react-bootstrap'
import LangSelector from "../languagehelper/langselector";
import { useBootstrapDirection } from "../languagehelper/useBootstrapDirection";

import { logout } from '../features/authSlice';
import { useNavigate,Link } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";

import { useTranslation } from "react-i18next";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { removeFromCart } from '../features/cartSlice';
import './header.css';
const NavigationBar = () => {
  const { i18n, t } = useTranslation("navbar");
  const items = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useBootstrapDirection();
    
      const user = useSelector((state: RootState) => state.auth.user);
    
      const handleLogout = () => {
        dispatch(logout());
        navigate("/logins");
      };
    
  return (
  <Navbar expand="lg" className="bg-light" >
  {/* === Top Row === */}
  <div className="w-100 d-flex justify-content-between align-items-center px-3 py-2 border-bottom nav-mobile">
    {/* Left: Brand */}
    <Navbar.Brand><div className="nav-title">MyShop</div></Navbar.Brand>

    {/* Right: Controls */}
    <div className="d-flex align-items-start gap-2 flex-wrap flex-grow-1">
      {/* Cart Dropdown */}
      {/* <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          🛒 Cart
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item>Item 1</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
      {/* Cart Dropdown */}
              <Dropdown align="start" className="">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-cart"
                  className="d-flex align-items-center"
                  size="sm"
                >
                  <FaShoppingCart color="white" fontSize="22px" />
                  <Badge bg="light" text="dark" className="ms-1">
                    {items.length}
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu
        style={{
          maxWidth: '95vw',       // full width on mobile
          minWidth: 250,          // desktop minimum
          maxHeight: '60vh',      // scroll if too tall
          overflowY: 'auto',
          padding: '0.5rem',
        }}
      >
        {items.length > 0 ? (
          <>
            {items.map((prod) => (
              <div
                key={prod.id}
                className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap"
              >
                <div className="d-flex flex-column flex-grow-1 me-2">
                  <span><strong>Product:</strong> {prod.name}</span>
                  <span>
                    <strong>Price:</strong>{" "}
                    {new Intl.NumberFormat(i18n.language, {
                      style: "currency",
                      currency: "SAR",
                    }).format(prod.price)}
                  </span>
                  <span><strong>Quantity:</strong> {prod.quantity}</span>
                </div>
      
                <AiFillDelete
                  fontSize="20px"
                  className="text-danger mt-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(removeFromCart(prod.id))}
                />
              </div>
            ))}
      
            <div className="d-flex justify-content-between p-2 fw-bold">
              <span>Total:</span>
              <span>
                {items
                  .reduce((sum, i) => sum + i.price * i.quantity, 0)
                  .toLocaleString(i18n.language, { style: "currency", currency: "SAR" })}
              </span>
            </div>
      
            <div className="d-flex justify-content-center">
              <Link to="/cart">
                <Button variant="primary" style={{ width: 'auto', margin: '0.5rem 0' }}>
                  Go To Cart
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <span className="d-block text-center p-3 text-muted">
            {t("Cart_is_Empty")}
          </span>
        )}
      </Dropdown.Menu>
      
              </Dropdown>

      {/* Account Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          👤 Account
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Language Selector */}
      <div className="mb-0">
        <LangSelector />
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-0">
          <span style={{ color: "blue" }}>
            {user} <BsPersonCircle />
          </span>
        </div>
      )}

      {/* Login Button (Only When Not Logged In) */}
      {!user && (
        <Link to="/logins" className="btn btn-outline-info btn-sm mb-0">
          Login
        </Link>
      )}
    </div>
  </div>

  {/* === Bottom Row === */}
  <Container fluid className="px-2 py-2" >
    <Navbar.Toggle aria-controls="navbarMain" />
    <Navbar.Collapse id="navbarMain">
      <Nav className="me-auto">
        <Nav.Link>Home</Nav.Link>
        <Nav.Link>Shop</Nav.Link>
      </Nav>

      {/* Search Bar */}
      <Form className="d-flex mt-2 mt-lg-0">
        <Form.Control
          type="search"
          placeholder="Search..."
          className="me-2"
        />
        <Button variant="outline-success">Search</Button>
      </Form>
    </Navbar.Collapse>
  </Container>
</Navbar>


  )
}

export default NavigationBar
