import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/authSlice";
//import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import i18next from "i18next";
export default function LoginForm() {
 const navigate = useNavigate();
const [searchParams] = useSearchParams();
const redirect = searchParams.get("redirect") || "/products";
  const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; }>({});
   const dispatch = useAppDispatch();
 const { loading, error, token } = useAppSelector((state) => state.auth);

 // Remove unused setError and email logic, and ensure error is displayed from Redux state

// ...existing code...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormErrors({});
  
  try {
    const result = await dispatch(login({ email, password })).unwrap();
    console.log("Login successful:", result);

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
      toast.error(
        typeof err.general === 'string' 
          ? err.general 
          : err.general[0]
      );
    } 
    // Case 4: Fallback
    else {
      toast.error(
        i18next.language === "ar" 
          ? "خطأ غير متوقع" 
          : "Unexpected error"
      );
    }
  }
};
// ...existing code...

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
             {/* {formErrors.email||formErrors.password&& */}
         <ul style={{color:'red',font:'red'}}>
          {formErrors.email&&<li>{formErrors.email}</li>}
          {formErrors.password&&<li>{formErrors.password}</li>}
          </ul>
   {/* } */}
            <Card.Body className="p-4">
              <h3 className="text-center mb-4 fw-semibold">Welcome User</h3>
     
    {token && <p>✅ Logged in with token</p>}
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

              <Form   onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-semibold">Email address</Form.Label>
                  <Form.Control
                   type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
                    className="rounded-3 py-2"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
                    className="rounded-3 py-2"
                  />
                </Form.Group>

                <Button
                  variant="primary"
              
                  className="w-100 rounded-3 py-2 fw-semibold"
                  type="submit" disabled={loading}
                >
                     {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Forgot your password?{" "}
                  <Link to="/forgot" className="text-decoration-none">
                    Click here
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

