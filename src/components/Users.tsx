import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {type RootState,type AppDispatch } from "../app/store";
import { fetchUsers, addUser, updateUser, deleteUser } from "../features/usersSlice";

const Users: React.FC = () => {
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAdd = () => {
    if (name && email) {
      dispatch(addUser({ name, email }));
      setName("");
      setEmail("");
    }
  };

  const handleUpdate = (id: number) => {
    dispatch(updateUser({ id, name: "FathiGasim", email: "FathiGasim@test.com" }));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users CRUD Demo</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleAdd}>Add User</button>
      </div>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}){" "}
            <button onClick={() => handleUpdate(u.id)}>Update</button>{" "}
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
