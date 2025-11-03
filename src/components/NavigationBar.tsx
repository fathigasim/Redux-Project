import React from 'react'
import { Navbar, Nav, Form, Button, Container, Dropdown } from 'react-bootstrap'
import LangSelector from "../languagehelper/langselector";
import { useBootstrapDirection } from "../languagehelper/useBootstrapDirection";

import { logout } from '../features/authSlice';
import { useNavigate,Link } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";
import { BsPersonCircle } from "react-icons/bs";
const NavigationBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useBootstrapDirection();
      const user = useSelector((state: RootState) => state.auth.user);
    
      const handleLogout = () => {
        dispatch(logout());
        navigate("/logins");
      };
    
  return (
  <Navbar expand="lg" className="bg-light flex-column" style={{marginBottom:'20px'}}>
  {/* === Top Row === */}
  <div className="w-100 d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
    {/* Left: Brand */}
    <Navbar.Brand>MyShop</Navbar.Brand>

    {/* Right: Controls */}
    <div className="d-flex align-items-center gap-2 flex-wrap">
      {/* Cart Dropdown */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          🛒 Cart
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item>Item 1</Dropdown.Item>
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
  <Container fluid className="px-3 py-2">
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
