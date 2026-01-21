import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { registerUser } from "../features/registerSlice";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
const Register = () => {
  const {t}=useTranslation("register");
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
   const [formErrors, setFormErrors] = useState<{ 
      userName?: string;
      email?: string; 
      password?: string; 
      confirmPassword?: string;

    }>({});
 // const [errors, setErrors] = useState<{ username?: string; password?: string;confirmPassword?: string; email?: string }>({});
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   // setErrors({});

    try {
    const result=  await dispatch(registerUser({ username, password,confirmPassword, email })).unwrap();
      setUsername("");
      setPassword("");
      setEmail("");
      setConfirmPassword("");
      setFormErrors({});
      if(result.message) {
        alert(result.message);
            setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: any) {
      if (err?.UserName || err?.Email || err?.Password||err?.ConfirmPassword) {
        setFormErrors({
          userName: Array.isArray(err.UserName) ? err.UserName[0] : undefined,
          email: Array.isArray(err.Email) ? err.Email[0] : undefined,
          password: Array.isArray(err.Password) ? err.Password[0] : undefined,
            confirmPassword: Array.isArray(err.ConfirmPassword) ? err.ConfirmPassword[0] : undefined,
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
      className="d-flex justify-content-center  bg-light amiri-regular"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={10} md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-start mb-4 fw-semibold">{t("register_title")}</h3>

              <Form noValidate onSubmit={handleSubmit} className="align-items-start">
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label className="fw-semibold">{t("username")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("username")}
                    value={username}
                    
                    onChange={(e) =>{
                       const englishOnly = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                      setUsername(englishOnly)}}
                    className="rounded-3 py-2"
                    required
                  />
                  {formErrors.userName && <div className="text-danger">{formErrors.userName}</div>}
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-semibold">{t("email")}</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) =>{
                       // eslint-disable-next-line no-control-regex
                       const asciiOnly = e.target.value.replace(/[^\x00-\x7F]/g, '');
                      setEmail(asciiOnly)
                     if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
                    }}
                      
                    // className="rounded-3 py-2"
                     className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
                    required
                  />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="fw-semibold">{t("password")}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) =>{

    // eslint-disable-next-line no-control-regex
    const asciiOnly = e.target.value.replace(/[^\x00-\x7F]/g, '');
    setPassword(asciiOnly);
                    }}
                    className="rounded-3 py-2"
                    required
                  />
                  {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                </Form.Group>

                 <Form.Group controlId="formconfirmPassword" className="mb-4">
                  <Form.Label className="fw-semibold">{t("confirm_password")}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={t("confirm_password")}
                    value={confirmPassword}
                    onChange={(e) =>{ setConfirmPassword(e.target.value)

                       if (formErrors.confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}}
                    className="rounded-3 py-2"
                    required
                  />
                  {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
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
                      {t("registering")}...
                    </>
                  ) : (
                    t("register")
                  )}
                </Button>
                <Link to="/login" className="d-block text-center mt-3">
                  {t("login")}
                </Link>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
