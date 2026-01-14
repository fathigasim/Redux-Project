import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, clearMessages } from "../features/manageSlice";
import { type RootState, type AppDispatch } from "../app/store";
import { Container,Form,Button } from "react-bootstrap";

export default function ForgotPassword() {
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
    // <Container className="" style={{marginTop:"40px !important",top:"100px"}}>
    // <div className="flex flex-col items-center justify-center h-screen bg-gray-50 ">
         
    //   <form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96 px-3 py-3">
    //     <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
    //       {formErrors && <p style={{ color: "red" }}>{formErrors.email}</p>}
    //     <label className="block mb-2 text-sm font-medium">Email</label>
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className="border rounded w-full p-2 mb-4"
    //       required
    //     />
    //           {emailSuccess && <p style={{ color: "green" }}>{emailSuccess}</p>} 
    //     <button
    //       type="submit"
    //       disabled={loading}
    //       className="bg-blue-600 text-black w-full py-2 rounded hover:bg-blue-700"
    //     >
    //       {loading ? "Sending..." : "Send Reset Link"}
    //     </button>
    //   </form>
    // </div>
    // </Container>
   
    <div style={{margin:"auto",maxWidth:"400px",justifyContent:"center"}} >
    <Form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96 px-3 py-3">
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control  type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required  placeholder="Enter email"
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
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </Form>
    </div>
  );
}
