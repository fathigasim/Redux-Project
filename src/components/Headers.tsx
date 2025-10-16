import { Navbar, Nav, Container, Form, Button, Dropdown, Badge } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cartSlice"; // adjust path
import { useTranslation } from "react-i18next";
import { logout } from "../features/authSlice";

export default function AppNavbar() {
  const { i18n } = useTranslation();
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
          🛒 Shopping Cart
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

              <Dropdown.Menu style={{ minWidth: 370 }}>
                {items.length > 0 ? (
                  <>
                    {items.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom"
                      >
                        <div>
                          <div className="fw-semibold">{prod.name}</div>
                          <div className="text-muted small">₹ {String(prod.price).split(".")[0]}</div>
                        </div>
                        <AiFillDelete
                          fontSize="20px"
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => dispatch(removeFromCart(prod.id))}
                        />
                      </div>
                    ))}
                    <Link to="/cart">
                      <Button variant="primary" style={{ width: "95%", margin: "10px" }}>
                        Go To Cart
                      </Button>
                    </Link>
                  </>
                ) : (
                  <span className="d-block text-center p-3 text-muted">Cart is Empty!</span>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Language Toggle */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant={i18n.language =="ar" ? "outline-light": "light"}
                size="sm"
                onClick={() => i18n.changeLanguage("ar")}
              >
                AR
              </Button>
              <Button
                 variant={i18n.language =="en" ? "outline-light": "light"}
                size="sm"
                onClick={() => i18n.changeLanguage("en")}
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
                  <Dropdown.Item as={Link} to="/logout" onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to="/" variant="outline-info">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
