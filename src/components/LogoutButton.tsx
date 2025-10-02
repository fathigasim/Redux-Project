//import { useAppDispatch } from "../app/hooks";
//import { revokeToken } from "../features/authSlice";

export  const LogoutButton =()=> {
 // const dispatch = useAppDispatch();

  const handleLogout = () => {
   // dispatch(revokeToken());
  };

  return <button onClick={handleLogout}>Logout from All Devices</button>;
}
