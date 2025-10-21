// import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/authSlice';
import { useTheme } from '../context/themeContext';

const Profile = () => {
  const dispatch = useAppDispatch();
 // const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  //if (!user) return null;

  return (
    <div style={{
      margin: '50px auto',
      maxWidth: '300px',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: theme === 'light' ? '#f9f9f9' : '#333',
      color: theme === 'light' ? '#000' : '#fff',
    }}>
      {/* <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p> */}
      <button onClick={() => dispatch(logout())} style={{ marginRight: '10px' }}>Logout</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

export default Profile;
