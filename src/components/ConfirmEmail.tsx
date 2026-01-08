import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    const confirm = async () => {
      const userId = searchParams.get("userId");
      const token = searchParams.get("token");

      if (!userId || !token) {
        setStatus("Invalid link.");
        return;
      }

      try {
        await api.get(`/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`);
        setStatus("Success! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("Confirmation failed. The link may be expired.");
      }
    };

    confirm();
  }, []);

  return <div className="p-10 text-center text-xl">{status}</div>;
}