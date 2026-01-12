// import React from 'react';
// import { useAppSelector } from '../app/hooks';

// const Dashboard = () => {
//   const { user, accessToken } = useAppSelector((state) => state.auth);

//   return (
//     <div style={{ margin: '20px' }}>
//       <h2>Dashboard</h2>
//       {user && <p>Hello, {user.name}</p>}
//       <p>Current Access Token: {accessToken}</p>
//     </div>
//   );
// };

// export default Dashboard;
 import  { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hook';
import { fetchUserProfile } from '../features/userSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ margin: '20px' }}>
      <h2>Dashboard</h2>
      {profile && (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
