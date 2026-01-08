import {useEffect,useState} from 'react'
import { Navbar, Nav, Form, Button, Container, Dropdown,Badge,NavDropdown } from 'react-bootstrap'
import LangSelector from "../languagehelper/langselector";
import { useBootstrapDirection } from "../languagehelper/useBootstrapDirection";

import { logout,logoutUser } from '../features/authSlice';
import { useNavigate,Link } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";

import { useTranslation } from "react-i18next";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { removeFromCart } from '../features/cartSlice';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { getUserRoles } from '../utils/jwtUtils';
import { BasketSummery,GetBasket } from '../features/basketSlice';
import i18next from "i18next";
import './header.css';
import logo from '../assets/transperantCommers.png';
const NavigationBar = () => {
  const { i18n, t } = useTranslation("navbar");
  const [searchParams, setSearchParams] = useSearchParams();
  
   
  
  const {items,basketSummery} = useSelector((state: RootState) => state.basket);
  const {  searchQuery } =
      useSelector((state: RootState) => state.products);
      const [localSearch, setLocalSearch] = useState(searchQuery ?? "");
       const [debouncedSearch] = useDebounce(localSearch, 500);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useBootstrapDirection();
    
      const {user,accessToken} = useSelector((state: RootState) => state.auth);
      const roles = accessToken ? getUserRoles(accessToken) : [];
      const adminRole=roles.includes("Admin");
      
  
      console.log("Current user in NavBar:", user);
     const handleLogout = async () => {
    // Dispatch the thunk. 
    // Since we handle state cleanup in extraReducers, this single line does everything.
    await dispatch(logoutUser()); 
    
    // Redirect after cleanup is done
    navigate("/login");
};
    useEffect(() => {
      const s = String(debouncedSearch);
      const currentSearch = searchParams.get("search") || "";
    
      if (s !== currentSearch) {
        const params = {
          ...Object.fromEntries(searchParams),
          search: s,
          page: "1",
        };
        setSearchParams(params);
      }
    }, [debouncedSearch]);

    useEffect(() => {

       try{
                      dispatch(BasketSummery()).unwrap();
      
                  console.log("Basket summery loaded")
                          
                }
      
                catch(err:any){
                       alert(err)
                }
    },[dispatch,items]);

    useEffect(() => {

       try{
                      dispatch(GetBasket());  
       }
                catch(err:any){
                       alert(err)
                }},[dispatch]);
  return (
<Navbar expand="lg" className="bg-light" style={{fontFamily:'intel-one-mono-roboto'}} >
  {/* === Top Row === */}
  <div className="w-100 d-flex justify-content-between align-items-center px-3 py-2">
    {/* Left: Brand */}
    <Navbar.Brand className="mb-0">
      {/* <div className="nav-title fw-bold">MyShop</div> */}
      <img src={logo} style={{width:"5rem",backgroundColor:'Background'}} alt='avatar'/>
    </Navbar.Brand>

    {/* Right: Controls */}
    <div className="d-flex align-items-center gap-2 flex-shrink-0">
      {/* Language Selector */}
      <div className="d-none d-md-block">
        <LangSelector />
      </div>

      {/* User Info */}
      {accessToken && (
        <div className="d-none d-lg-flex align-items-center">
          <span style={{ color: "blue" }} className="text-nowrap">
            {user} <BsPersonCircle />
          </span>
        </div>
      )}

      {/* Login Button (Only When Not Logged In) */}
      {!user&& 
        <Link to="/login" className="btn btn-outline-info btn-sm">
          Login
        </Link>
      }

      {/* Cart Dropdown */}
      {user&&
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-cart"
          className="d-flex align-items-center"
          size="sm"
        >
          <FaShoppingCart color="white" fontSize="22px" />
          <Badge bg="light" text="dark" className="ms-1">
            <span style={{gap:'0.5rem'}}>{basketSummery.basketCount}</span>
            {/* <span>{basketSummery.basketTotal}</span> */}
          </Badge>
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{
            maxWidth: '95vw',
            minWidth: 250,
            maxHeight: '60vh',
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
                    <span><strong>Product:</strong> {prod.productName}</span>
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
                <Link to="/basket" style={{ textDecoration: 'none' }}>
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
}
      {/* Account Dropdown */}
      {user &&
      <Dropdown align="end">
        <Dropdown.Toggle variant="outline-secondary" size="sm">
          👤 {t("Account")}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout }>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
  }
       {/* Account Dropdown */}
      <div>
       <NavDropdown title={t("Orders")} id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1"><Link to="/orders" style={{textDecoration:'none',color:'black'}}>OrdersList</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/orderByDateRep" style={{textDecoration:'none',color:'black'}}>Order By Date</Link></NavDropdown.Item>
        {/* <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item> */}
      </NavDropdown>
    </div>

     {/* Product Management */}
     {adminRole&&
      <div>
       <NavDropdown title="ProductManagement" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1"><Link to="/product" style={{textDecoration:'none',color:'black'}}>{t("ProductManagement")}</Link></NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"><Link to="/orderByDateRep" style={{textDecoration:'none',color:'black'}}>Order By Date</Link></NavDropdown.Item>
        {/* <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item> */}
      </NavDropdown>
     
    </div>
}
  </div>

  {/* === Bottom Row === */}
  <Container fluid className="px-2 py-2">
    <Navbar.Toggle aria-controls="navbarMain" />
    <Navbar.Collapse id="navbarMain">
      <Nav className="me-auto">
        <Link to="/products" style={{textDecoration:"none",color:"black"}}>{t("Products")}</Link>
         
        
      </Nav>

      {/* Search Bar */}
      <Form className="d-flex mt-2 mt-lg-0">
        <Form.Control
           placeholder={i18next.language === "ar" ? "بحث..." : "Search..."}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          style={{ minWidth: '200px' }}
        />
        {/* <Button variant="outline-success">Search</Button> */}
      </Form>
    </Navbar.Collapse>
  </Container>
  </div>
</Navbar>


  )
}

export default NavigationBar
