import { Navbar, Nav, Container, Form, Button, Dropdown, Badge,Col,Row } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cartSlice"; // adjust path
import { useTranslation } from "react-i18next";
import { logout } from "../features/authSlice";

import { BsPersonCircle } from 'react-icons/bs';


export default function AppNavbar() {
  
    const { i18n,t } = useTranslation("navbar");
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = () => {
    dispatch(logout());
    navigate("/logins");
  };

  const items = useSelector((state: any) => state.cart.items);
  const [localSearch, setLocalSearch] = useState("");
  const isAuthenticated = useSelector((state: any) => state.auth.token !== null);
  
  const user = useSelector((state: any) => state.auth.user);
  console.log(i18n.hasResourceBundle("en", "navbar"));
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      fixed="top"
      className="shadow-sm py-3"
      style={{ height: "80px", zIndex: 1030 }}
    >
      <Container fluid className="align-items-center">
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          🛒 {t("ShoppingCart")}
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="navbarResponsive" />

        <Navbar.Collapse id="navbarResponsive" className="justify-content-between">
          {/* Search Bar */}
          <Form className="mx-auto my-2 my-md-0" style={{ maxWidth: "350px",  flexGrow: 1 }}>
            <Form.Control
              type="text"
              placeholder="Search Product"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="me-2"
            />
          </Form>

          {/* Right Section (Cart + Language + Auth) */}
          <Nav className="d-flex align-items-center ms-auto gap-3">
            {/* Cart Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="success" id="dropdown-cart" className="d-flex align-items-center">
                <FaShoppingCart color="white" fontSize="22px" />
                <Badge bg="light" text="dark" className="ms-1">
                  {items.length}
                </Badge>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: 450 }}>
                {items.length > 0 ? (
                  <>
                    {items.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom"
                      >
                        <div>
                          {/* <div className="fw-semibold"><span style={{margin:5}}>product:</span>{prod.name}</div>
                          <div className="text-muted small"><span style={{margin:5}}>price:₹ </span>{String(prod.price).split(".")[0]}</div>
                          <div className="text-muted small"><span style={{margin:5}}>Quantity</span>{String(prod.quantity)}</div>
                        */}
                        <Container>
                        <Row>
        <Col md><span style={{margin:2}}>product:</span>{prod.name}</Col>
        <Col md><span style={{margin:2}}>price:</span>{new Intl.NumberFormat(i18n.language, {
  style: 'currency',
  currency: 'SAR',
}).format(prod.price)}</Col>
        <Col md><span style={{margin:5}}>Quantity</span>{String(prod.quantity)}</Col>
      </Row>
      </Container>
                        </div>
                        <AiFillDelete
                          fontSize="20px"
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(removeFromCart(prod.id))}
                        />
                      </div>
                    ))}
                   <span>Total:   {items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)}</span>
                    <div className="d-flex justify-content-center">
                      <Link to="/cart">
                        <Button variant="primary" style={{ width: "95%", margin: "10px" }}>
                          Go To Cart
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <span className="d-block text-center p-3 text-muted">{t("Cart_is_Empty")}</span>
                )}
              </Dropdown.Menu>
            </Dropdown>
           {/*User*/}
           <div className="d-flex align-items-center gap-2">
            {user&&<span style={{color:"blue"}}> {user} <BsPersonCircle style={{height:100}}/> </span>}
           </div>
            {/* Language Toggle */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant={i18n.language =="ar" ? "outline-light": "light"}
                size="sm"
                onClick={() =>{ i18n.changeLanguage("ar")
                  document.body.dir = "rtl";
                }}
              >
                AR
              </Button>
              <Button
                 variant={i18n.language =="en" ? "outline-light": "light"}
                size="sm"
                onClick={() =>{i18n.changeLanguage("en")
                  document.body.dir = "ltr";
                }}
              >
                EN
              </Button>
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-info" id="dropdown-user">
                  {user?.userName || "Profile"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/logins" onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // <Button as={Link} to="/logins" variant="outline-info">
              //   Login
              // </Button>
              <Link to='/Logins'>Login</Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
