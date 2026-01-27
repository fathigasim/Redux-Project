import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, clearMessages } from "../features/manageSlice";
import { type RootState, type AppDispatch } from "../app/store";
import { Container,Form,Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
export default function ForgotPassword() {
  const { t } = useTranslation("usermanagement");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.manage
  );

  const [email, setEmail] = useState("");
  const [emailSuccess,setEmailSuccess]=useState("");
   const [formErrors, setFormErrors] = useState<{ email?: string;}>({});
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    try{
    const result=await dispatch(forgotPassword({ email })).unwrap();
    setEmailSuccess(result.message);
    console.log("Forgot password success:", result);
    setEmail("");
    setFormErrors({});
    }
    catch(err:any){
      console.error("Failed to send forgot password request:", err?.mailerror);

      if(err?.mailerror){
      setFormErrors({email:  err?.mailerror })
    }
    else{
       setFormErrors({email:'An unexpected error occurred.'})
    }
    }
    
  };

  useEffect(() => {
    if (error) {
     toast.error(error);
    console.log("Error:", error);
     
      dispatch(clearMessages());
    }
    if (success) {
     // toast.success(success);
      dispatch(clearMessages());
    }
  }, [dispatch,error, success]);

  return (
   
    <div style={{margin:"auto",maxWidth:"400px",justifyContent:"center"}} >
    <Form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96 px-3 py-3">
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>{t("email")}</Form.Label>
        <Form.Control  type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
           placeholder={t("Enter_email")}
      />
      {emailSuccess && <p style={{ color: "green" }}>{emailSuccess}</p>}
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group> */}
       <Button variant="primary" type="submit"
        disabled={loading}
           className="bg-blue-600 text-black w-full py-2 rounded hover:bg-blue-700"
       >
        {loading ? `${t("sending")}` : `${t("send_reset_link")}`}
      </Button>
    </Form>
    </div>
  );
}
