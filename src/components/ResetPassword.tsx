import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetPassword, clearMessages } from "../features/manageSlice";
import { type RootState, type AppDispatch } from "../app/store";


export default function ResetPassword() {
  const [resetError, setResetError] = useState<{newPassword:string}>({newPassword:""});
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.manage
  );
    const { token } = useSelector(
    (state: RootState) => state.auth
  );

  //const [searchParams] = useSearchParams();
  //const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }
  try{
     await dispatch(resetPassword({ token, newPassword })).unwrap();
     }
    catch(err:any){
        console.error("Failed to reset password:", err.message);
        if(err?.message){
          setResetError({newPassword: err?.message});
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
      navigate("/logins");
    }
  }, [dispatch,navigate,error, success]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <form noValidate onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
    {resetError && <p style={{ color: "red" }}>{resetError.newPassword}</p>}
        <label className="block mb-2 text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded w-full p-2 mb-4"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
