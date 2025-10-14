import { Badge, Container, Dropdown, Form, Navbar,Nav, Button } from "react-bootstrap"
import { useState,useEffect } from "react";
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from "react-router-dom";
import {type RootState } from "../app/store";
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '../features/cartSlice'
import { useSearchParams } from "react-router-dom";
// import {type CartState } from '../features/cartSlice';
import { filterBySearch } from '../features/productSlice';
import { AiFillDelete } from "react-icons/ai";
import { useDebounce } from "use-debounce";
import i18n from "../i18n";
// import LanguageSelector from "./LanguageSelector";
const Header = () => {
    const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
//   const {state:{cart},dispatch,productDispatch}=CartState();
      const [searchParams, setSearchParams] = useSearchParams();
  

  // ✅ Initialize search state from URL
  const initialSearch = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // ✅ When the debounced value changes, update Redux + URL
  useEffect(() => {
    dispatch(filterBySearch(debouncedSearch));
    const params = Object.fromEntries(searchParams.entries());
    if (debouncedSearch) {
      setSearchParams({ ...params, search: debouncedSearch });
    } else {
      // remove search param when cleared
      const { search, ...rest } = params;
      setSearchParams(rest);
    }
  }, [debouncedSearch]);
  const lang = localStorage.getItem("lang") || "en";
  return (
       <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      fixed="top"
      className="shadow-sm py-3"
      style={{ height: 80,marginBottom:100 }}
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          🛒 Shopping Cart
        </Navbar.Brand>

        {/* Hamburger Toggle */}
        <Navbar.Toggle aria-controls="navbarResponsive" />

        {/* Collapsible Section */}
        <Navbar.Collapse id="navbarResponsive">
          {/* Search Bar (centered on medium+, stacked on small) */}
          <Form className="mx-auto my-2 my-md-0" style={{ maxWidth: 500, flex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Search Product"
              className="me-2"
              value={localSearch}
            //   onChange={(e) => {
            //     // productDispatch({
            //     //   type: 'FILTER_BY_SEARCH',
            //     //   payload: e.target.value,
            //     // });
            //     dispatch(filterBySearch(e.target.value))
            //   }}
                    onChange={(e) => setLocalSearch(e.target.value)}
        defaultValue={searchParams.get("search") || ""}

            />
          </Form>

          {/* Cart Dropdown (always right-aligned) */}
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="success" id="dropdown-cart">
                <FaShoppingCart color="white" fontSize="22px" />
                <Badge bg="light" text="dark" className="ms-1">
                  {items.length}
                </Badge>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: 370 }}>
                {items.length > 0 ? (
                  <>
                    {items.map((prod) => (
                      <div
                        key={prod.id}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom"
                      >
                        <div>
                          <div className="fw-semibold">{prod.name}</div>
                          <div className="text-muted small">₹ {String(prod.price).split('.')[0]}</div>
                        </div>
                        <AiFillDelete
                          fontSize="20px"
                          className="text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => dispatch(removeFromCart(prod.id))}
                        />
                      </div>
                    ))}
                    <Link to="/cart">
                      <Button variant="primary" style={{ width: '95%', margin: '10px' }}>
                        Go To Cart
                      </Button>
                    </Link>
                  </>
                ) : (
                  <span className="d-block text-center p-3 text-muted">Cart is Empty!</span>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <div style={{ direction: lang === "ar" ? "rtl" : "ltr", padding: "2rem" }}>
                  {/* <LanguageSelector /> */}
                  <button onClick={() => i18n.changeLanguage("ar")}>AR</button>
<button onClick={() => i18n.changeLanguage("en")}>EN</button>

            </div>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
