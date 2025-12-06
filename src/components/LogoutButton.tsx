
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export  const LogoutButton =()=> {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Logout from All Devices</button>;
}
