import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Form, Button, Dropdown, Badge, Col, Row } from "react-bootstrap";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import i18next from "i18next";

import LangSelector from "../languagehelper/langselector";
import { removeFromCart } from "../features/cartSlice";
import { logout } from "../features/authSlice";
import { filterBySearch, fetchProducts, setPage } from "../features/productSlice";
import { clearSuggestions, fetchSuggestions } from "../features/suggestionSlice";
import { type RootState, type AppDispatch } from "../app/store";
import './header.css'
export default function AppNavbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { i18n, t } = useTranslation("navbar");
  const items = useSelector((state: RootState) => state.cart.items);
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);
  const user = useSelector((state: RootState) => state.auth.user);

  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch] = useDebounce(localSearch, 500);
  // const suggestions = useSelector((state: RootState) => state.seggessions.items);

  // 🔹 Update global search in Redux when debouncedSearch changes
  useEffect(() => {
    dispatch(filterBySearch(debouncedSearch));

    // Only trigger fetching on product-related pages (optional)
    if (location.pathname.startsWith("/product") || location.pathname === "/") {
      dispatch(setPage(1));
      dispatch(fetchProducts({ searchQuery: debouncedSearch, page: 1 }));
    }

    // Sync search param in URL
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearch !== currentSearch) {
      setSearchParams({ search: debouncedSearch });
    }
  }, [debouncedSearch]);
  // Fetch suggestions on debounced input
  // useEffect(() => {
  //   if (debouncedSearch.trim() === "") {
  //     dispatch(clearSuggestions());
  //     return;
  //   }
  //   dispatch(fetchSuggestions(debouncedSearch));
  // }, [debouncedSearch]);

  // // Navigate when user selects a suggestion
  // const handleSelectSuggestion = (name: string) => {
  //   setLocalSearch(name);
  //   dispatch(clearSuggestions());
  //   setSearchParams({ search: name, page: "1" });
  //   navigate(`/product?search=${encodeURIComponent(name)}&page=1`);
  // };


  const handleLogout = () => {
    dispatch(logout());
    navigate("/logins");
  };

  return (
    <Navbar
  bg="dark"
  variant="dark"
  expand="md" // expands on medium screens and up
  fixed="top"
  className="shadow-sm py-3"
  style={{ height: "80px", zIndex: 1030 }}
>
  <Container fluid className="align-items-center">
    {/* Brand */}
    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
      🛒 {t("ShoppingCart")}
    </Navbar.Brand>

    {/* Toggle button for mobile */}
    <Navbar.Toggle aria-controls="navbarResponsive" />

    {/* Collapse section */}
    <Navbar.Collapse id="navbarResponsive" className="justify-content-between">
      {/* Search Bar */}
      <div className="flex-grow-1 mx-2 position-relative">
        <Form className="w-100 mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </Form>

        {/* Suggestion dropdown */}
        {/* {suggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 2000 }}
          >
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectSuggestion(item.name)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )} */}
      </div>

      {/* Right section */}
      <Nav className="d-flex align-items-center ms-auto gap-2 gap-md-3 flex-wrap">
        {/* Cart Dropdown */}
        <Dropdown align="end" className="mb-2 mb-md-0">
          <Dropdown.Toggle
            variant="success"
            id="dropdown-cart"
            className="d-flex align-items-center"
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

        {/* User Info */}
        {user && (
          <div className="d-flex align-items-center gap-1 mb-2 mb-md-0">
            <span style={{ color: "blue" }}>
              {user} <BsPersonCircle />
            </span>
          </div>
        )}

        {/* Language Selector */}
        <div className="mb-2 mb-md-0">
          <LangSelector />
        </div>

        {/* Auth Section */}
        {isAuthenticated ? (
          <Dropdown align="end" className="mb-2 mb-md-0">
            <Dropdown.Toggle variant="outline-info" id="dropdown-user">
              {user || "Profile"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/orders">
                My Orders
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link to="/logins" className="btn btn-outline-info mb-2 mb-md-0">
            Login
          </Link>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}
