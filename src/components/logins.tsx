import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/authSlice";
//import { useNavigate } from "react-router-dom";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

export default function LoginForm() {
 const navigate = useNavigate();
const [searchParams] = useSearchParams();
const redirect = searchParams.get("redirect") || "/products";
  const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useAppDispatch();
 const { loading, error, token } = useAppSelector((state) => state.auth);

 // Remove unused setError and email logic, and ensure error is displayed from Redux state

// ...existing code...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await dispatch(login({ email, password })).unwrap();
    console.log("Login successful:", result);

    // Prevent open redirect attacks by only allowing internal paths
    const safeRedirect = redirect && redirect.startsWith("/") ? redirect : "/products";
    navigate(safeRedirect, { replace: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to login:", msg);
    // Optionally dispatch an action or show a toast here to surface the error to the user
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
            <Card.Body className="p-4">
              <h3 className="text-center mb-4 fw-semibold">Welcome User</h3>
    {token && <p>✅ Logged in with token</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

              <Form onSubmit={handleSubmit}>
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
                    Reset here
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

