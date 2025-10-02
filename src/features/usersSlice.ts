import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Fetch all
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return (await res.json()) as User[];
  }
);

// Add (Omit id)
export const addUser = createAsyncThunk<User, Omit<User, "id">>(
  "users/addUser",
  async (newUser) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  }
);

// Update (Partial<User>)
export const updateUser = createAsyncThunk<User, Partial<User>>(
  "users/updateUser",
  async (user) => {
    if (!user.id) throw new Error("User ID is required");
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${user.id}`,
      {
        method: "PUT",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      }
    );
    return await res.json();
  }
);

// Delete
export const deleteUser = createAsyncThunk<number, number>(
  "users/deleteUser",
  async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching users";
      })
      // Add
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index >= 0) state.users[index] = action.payload;
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
