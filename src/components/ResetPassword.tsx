import React, { useState, useEffect } from "react";
import { useNavigate ,useSearchParams} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetPassword, clearMessages } from "../features/manageSlice";
import { type RootState, type AppDispatch } from "../app/store";
import { Alert, Col, Row } from 'react-bootstrap'

export default function ResetPassword() {
  const [resetError, setResetError] = useState<{newPassword:string, newPasswordConfirm?:string}>
  ({newPassword:"", newPasswordConfirm:""});
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.manage
  );
  //   const { token } = useSelector(
  //   (state: RootState) => state.auth
  // );

  //const [searchParams] = useSearchParams();
  //const token = searchParams.get("token");

    const userId = searchParams.get("userId");
      const token = searchParams.get("token");

    
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }
  try{
     await dispatch(resetPassword({userId,token,newPassword, confirmPassword })).unwrap();
     }
    catch(err:any){
        console.error("Failed to reset password:", err.message);
        if(err?.message){
          setResetError({newPassword: err?.message, newPasswordConfirm: err?.message});
        }
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (success) {
      toast.success(success);
      dispatch(clearMessages());
     setTimeout(() => navigate("/login"), 2000);
    }
  }, [dispatch,navigate,error, success]);

  return (
    <Row lg={6} md={8} sm={12} >
      <Col className="p-4">
      <form noValidate onSubmit={handleSubmit} className="bg-white shadow rounded w-96">
   
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
    {resetError && <p style={{ color: "red" }}>{resetError.newPassword}</p>}
     <Row className="mt-3">
        <label className="block mb-2 text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
          minLength={6}
        />
        </Row>
    {resetError && <p style={{ color: "red" }}>{resetError.newPassword}</p>}
       <Row className="mt-3">
        <label className="block mb-2 text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
          minLength={6}
        />
</Row>
<Row className="mt-3">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        </Row>
      </form>
      
      </Col>
    </Row>
  );
}
