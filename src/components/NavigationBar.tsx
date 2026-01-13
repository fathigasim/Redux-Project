import { useEffect, useState } from 'react';
import { Navbar, Nav, Form, Button, Container, Dropdown, Badge, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';

import { type RootState, type AppDispatch } from '../app/store';
import { logoutUser } from '../features/authSlice';
import { removeFromCart } from '../features/cartSlice';
import { useBootstrapDirection } from '../languagehelper/useBootstrapDirection';
import { getUserRoles } from '../utils/jwtUtils';
import LanguageSelector from './LanguageSelector';
import './header.css';
import logo from '../assets/transperantCommers.png';

const NavigationBar = () => {
  const { i18n, t } = useTranslation('navbar');
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useBootstrapDirection();

  // Selectors
  const { items, basketSummery } = useSelector((state: RootState) => state.basket);
  const { searchQuery } = useSelector((state: RootState) => state.products);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  // Local state
  const [localSearch, setLocalSearch] = useState(searchQuery ?? '');
  const [debouncedSearch] = useDebounce(localSearch, 500);

  // Derived values
  const roles = accessToken ? getUserRoles(accessToken) : [];
  const isAdmin = roles.includes('Admin');
  const isLoggedIn = Boolean(user && accessToken);

  // Calculate cart total
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);

  // Handlers
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearch.trim()) {
      setSearchParams({ q: debouncedSearch });
      navigate(`/products?q=${debouncedSearch}`);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // Update search params when debounced search changes
  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ q: debouncedSearch });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearch, setSearchParams]);

  return (
    <Navbar expand="lg" className="bg-light" style={{ fontFamily: 'intel-one-mono-roboto' }}>
      {/* === Top Row === */}
      <div className="w-100 d-flex justify-content-between align-items-center px-3 py-2">
        {/* Left: Brand */}
        <Navbar.Brand as={Link} to="/" className="mb-0">
          <img src={logo} style={{ width: '5rem' }} alt="MyShop Logo" />
        </Navbar.Brand>

        {/* Right: Controls */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {/* Language Selector */}
          <div className="d-none d-md-block">
            <LanguageSelector />
          </div>

          {/* User Info */}
          {isLoggedIn && (
            <div className="d-none d-lg-flex align-items-center">
              <span style={{ color: 'blue' }} className="text-nowrap">
                {user} <BsPersonCircle />
              </span>
            </div>
          )}

          {/* Login Button (Only When Not Logged In) */}
          {!isLoggedIn && (
            <Link to="/login" className="btn btn-outline-info btn-sm">
              {t('Login')}
            </Link>
          )}

          {/* Cart Dropdown */}
          {isLoggedIn && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-cart"
                className="d-flex align-items-center"
                size="sm"
              >
                <FaShoppingCart color="white" fontSize="22px" />
                <Badge bg="light" text="dark" className="ms-1">
                  {basketSummery.basketCount}
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
                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom flex-wrap"
                      >
                        <div className="d-flex flex-column flex-grow-1 me-2">
                          <span>
                            <strong>{t('Product')}:</strong> {product.productName}
                          </span>
                          <span>
                            <strong>{t('Price')}:</strong> {formatCurrency(product.price)}
                          </span>
                          <span>
                            <strong>{t('Quantity')}:</strong> {product.quantity}
                          </span>
                        </div>

                        <AiFillDelete
                          fontSize="20px"
                          className="text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveFromCart(product.id.toString())}
                          aria-label={t('Remove from cart')}
                        />
                      </div>
                    ))}

                    <div className="d-flex justify-content-between p-2 fw-bold">
                      <span>{t('Total')}:</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>

                    <div className="d-flex justify-content-center">
                      <Button
                        as={Link}
                        to="/basket"
                        variant="primary"
                        style={{ width: 'auto', margin: '0.5rem 0' }}
                      >
                        {t('Go_To_Cart')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <span className="d-block text-center p-3 text-muted">
                    {t('Cart_is_Empty')}
                  </span>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Account Dropdown */}
          {isLoggedIn && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                👤 {t('Account')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  {t('Profile')}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>{t('Logout')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Orders Dropdown */}
          {isLoggedIn && (
            <NavDropdown title={t('Orders')} id="nav-dropdown-orders">
              <NavDropdown.Item as={Link} to="/orders">
                {t('Orders_List')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/orderByDateRep">
                {t('Order_By_Date')}
              </NavDropdown.Item>
            </NavDropdown>
          )}

          {/* Product Management (Admin Only) */}
          {isAdmin && (
            <NavDropdown title={t('Product_Management')} id="nav-dropdown-admin">
              <NavDropdown.Item as={Link} to="/product">
                {t('ProductManagement')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/orderByDateRep">
                {t('Order_By_Date')}
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </div>
      </div>

      {/* === Bottom Row === */}
      <Container fluid className="px-2 py-2">
        <Navbar.Toggle aria-controls="navbarMain" />
        <Navbar.Collapse id="navbarMain">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">
              {t('Products')}
            </Nav.Link>
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex mt-2 mt-lg-0" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder={t('Search_Placeholder')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ minWidth: '200px' }}
              aria-label={t('Search')}
            />
            <Button variant="outline-primary" type="submit" className="ms-2">
              {t('Search')}
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;