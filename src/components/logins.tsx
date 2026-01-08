import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import i18next from "i18next";

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; }>({});
  
  const dispatch = useAppDispatch();
  // FIXED: Destructure accessToken correctly (was token)
  const { loading, accessToken } = useAppSelector((state) => state.auth);

  // Optional: Redirect if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate(redirect, { replace: true });
    }
  }, [accessToken, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({}); // Clear previous errors

    try {
      await dispatch(login({ email, password })).unwrap();
      console.log("Login successful");
      
      const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/products";
      navigate(safeRedirect, { replace: true });
      
    } catch (err: any) {
      console.log("Login failed:", err);

      // Case 1: Field-level validation errors (email, password)
      if (err?.email || err?.password) {
        setFormErrors({
          email: Array.isArray(err.email) ? err.email[0] : err.email,
          password: Array.isArray(err.password) ? err.password[0] : err.password,
        });
      }
      // Case 2: Bad credentials error
      else if (err?.passError) {
        toast.error(err.passError);
      }
      // Case 3: General error message
      else if (err?.general) {
        toast.error(typeof err.general === 'string' ? err.general : err.general[0]);
      }
      // Case 4: Fallback
      else {
        toast.error(i18next.language === "ar" ? "خطأ غير متوقع" : "Unexpected error");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4 fw-semibold">Welcome User</h3>

              <Form onSubmit={handleSubmit}>
                
                {/* EMAIL INPUT */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-semibold">Email address</Form.Label>
                  <Form.Control
                    type="email" // Changed to 'email' for better validation
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error when user types
                      if(formErrors.email) setFormErrors(prev => ({...prev, email: undefined}));
                    }}
                    className="rounded-3 py-2"
                    isInvalid={!!formErrors.email} // Bootstrap Validation Styling
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* PASSWORD INPUT */}
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if(formErrors.password) setFormErrors(prev => ({...prev, password: undefined}));
                    }}
                    className="rounded-3 py-2"
                    isInvalid={!!formErrors.password} // Bootstrap Validation Styling
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 rounded-3 py-2 fw-semibold"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-3 d-flex justify-content-between">
                <small className="text-muted">
                  <Link to="/forgot" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </small>
                <small className="text-muted">
                  No account?{" "}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Register
                  </Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}