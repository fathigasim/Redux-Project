import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/registerSlice";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string; email?: string }>({});
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(registerUser({ username, password, email })).unwrap();
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (err: any) {
      if (err?.username || err?.email || err?.password) {
        setErrors({
          username: Array.isArray(err.username) ? err.username[0] : undefined,
          email: Array.isArray(err.email) ? err.email[0] : undefined,
          password: Array.isArray(err.password) ? err.password[0] : undefined,
        });
      } else if (err?.message) {
        console.error(err.message);
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center  bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-start mb-4 fw-semibold">Register</h3>

              <Form noValidate onSubmit={handleSubmit} className="align-items-start">
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label className="fw-semibold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-3 py-2"
                    required
                  />
                  {errors.username && <div className="text-danger">{errors.username}</div>}
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-3 py-2"
                    required
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-3 py-2"
                    required
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 rounded-3 py-2 fw-semibold"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
