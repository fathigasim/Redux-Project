// pages/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { login, clearError } from "../features/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import i18next from "i18next";

interface LocationState {
  from?: string;
  message?: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // ✅ Get return URL from location state (set by RequireAuth)
  const state = location.state as LocationState;
  const returnUrl = state?.from || "/"; // Default to dashboard
  // const redirectMessage = state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ 
    email?: string; 
    password?: string; 
  }>({});

  const { loading, accessToken } = useAppSelector((state) => state.auth);

  // ✅ Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (accessToken) {
      console.log(`✅ Already logged in - Redirecting to: ${returnUrl}`);
      navigate(returnUrl, { replace: true });
    }
  }, [accessToken, navigate, returnUrl]);
// useEffect(() => {
//   // Save return URL to sessionStorage
//   if (returnUrl && returnUrl !== "/dashboard") {
//     sessionStorage.setItem("returnUrl", returnUrl);
//   }
// }, [returnUrl]);

// // In handleSubmit after successful login:
// const savedReturnUrl = sessionStorage.getItem("returnUrl");
// const finalRedirect = savedReturnUrl || returnUrl || "/";
// sessionStorage.removeItem("returnUrl");
// navigate(finalRedirect, { replace: true });
//   // ✅ Show redirect message as toast
//   useEffect(() => {
//     if (redirectMessage) {
//       toast.info(redirectMessage, {
//         position: "top-center",
//         autoClose: 4000
//       });
//     }
//   }, [redirectMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({}); // Clear previous errors

    try {
      await dispatch(login({ email, password })).unwrap();
      
      console.log(`✅ Login successful - Redirecting to: ${returnUrl}`);
      
      // ✅ Validate return URL (prevent open redirect vulnerability)
      const safeRedirect = returnUrl && returnUrl.startsWith("/") 
        ? returnUrl 
        : "/dashboard";
      
      toast.success(
        i18next.language === "ar" 
          ? "تم تسجيل الدخول بنجاح" 
          : "Login successful"
      );
      
      // ✅ Navigate to return URL
      navigate(safeRedirect, { replace: true });
      
    } catch (err: any) {
      console.error("❌ Login failed:", err);

      // Case 1: Field-level validation errors from backend
      if (err?.Email || err?.Password) {
        setFormErrors({
          email: Array.isArray(err.Email) ? err.Email[0] : err.Email,
          password: Array.isArray(err.Password) ? err.Password[0] : err.Password,
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
      // Case 4: Session invalidated (logged in elsewhere)
      else if (
        err?.message?.toLowerCase().includes('invalidated') ||
        err?.message?.toLowerCase().includes('logged in elsewhere')
      ) {
        toast.error(
          i18next.language === "ar"
            ? "تم تسجيل الدخول من جهاز آخر"
            : "Your session was invalidated. Please log in again."
        );
      }
      // Case 5: Fallback
      else {
        toast.error(
          i18next.language === "ar" 
            ? "خطأ غير متوقع" 
            : "Unexpected error"
        );
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light amiri-regular"
      style={{ minHeight: "100vh",maxWidth: '500vw' }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={10} md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              {/* <h3 className="text-center mb-4 fw-semibold">
                {i18next.language === "ar" ? "مرحباً بك" : "Welcome Back"}
              </h3> */}

              {/* ✅ Show info about where they'll be redirected */}
              {returnUrl && returnUrl !== "/dashboard" && (
                <Alert variant="info" className="mb-3">
                  <small>
                    {i18next.language === "ar" 
                      ? `سيتم توجيهك إلى: ${returnUrl}` 
                      : `You'll be redirected to: ${returnUrl}`}
                  </small>
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                
                {/* EMAIL INPUT */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="fw-semibold">
                    {i18next.language === "ar" ? "البريد الإلكتروني" : "Email address"}
                  </Form.Label>
                  <Form.Control
                    type="email"
                      dir={i18next.language === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={
                      i18next.language === "ar" 
                        ? "name@example.com" 
                        : "name@example.com"
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    // className="rounded-3 py-2 "
                    className={`rounded-3 py-2 ${i18next.language === 'ar' ? 'text-end' : 'text-start'}`}
                    isInvalid={!!formErrors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* PASSWORD INPUT */}
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="fw-semibold">
                    {i18next.language === "ar" ? "كلمة المرور" : "Password"}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={i18next.language === "ar" ? "كلمة المرور" : "Password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) {
                        setFormErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    className="rounded-3 py-2"
                    isInvalid={!!formErrors.password}
                    disabled={loading}
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
                      <span 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status" 
                        aria-hidden="true"
                      />
                      {i18next.language === "ar" ? "جاري تسجيل الدخول..." : "Logging in..."}
                    </>
                  ) : (
                    i18next.language === "ar" ? "تسجيل الدخول" : "Login"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3 d-flex justify-content-between">
                <small className="text-muted">
                  <Link to="/forgot-password" className="text-decoration-none">
                    {i18next.language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </Link>
                </small>
                <small className="text-muted">
                  {i18next.language === "ar" ? "لا تملك حساب؟ " : "No account? "}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    {i18next.language === "ar" ? "سجل الآن" : "Register"}
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