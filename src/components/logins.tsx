import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/authSlice";

import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

export default function LoginForm() {
  const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useAppDispatch();
 const { loading, error, token } = useAppSelector((state) => state.auth);

 // Remove unused setError and email logic, and ensure error is displayed from Redux state

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   try {
   dispatch(login({ username, password })).unwrap();
   } catch (err) {
        console.error("Failed to login:", err);
 };}

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
                  <a href="/forgot" className="text-decoration-none">
                    Reset here
                  </a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

