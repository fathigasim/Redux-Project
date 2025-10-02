import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";
export interface Product {
 id:string;
 name:string;
 price:number;
 
}

interface ProductState{
    product:Product[],
    loading:boolean,
    error:string|null

}

const initialState:ProductState={
    product:[],
    loading:false,
    error:null 
} 

// Fetch all
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const res =await api.get("https://localhost:7171/api/Products");
    return res.data;
  }
);

// Add (Omit id)
// , Omit<Product, "id">
export const addProduct = createAsyncThunk<Product,Omit<Product,"id">>(
  "products/addProduct",
  async (newProduct:{name:string,price:number}) => {
    const res =await api.post("/api/Products", newProduct);
    return  res.data;
  }
);




export const updateProduct = createAsyncThunk<
  Product, // ⬅️ The type of data returned (the updated product)
  Partial<Product> // ⬅️ The type of the argument passed when dispatching
>(
  "product/updateProduct",
  async (productData) => {
    const { id, ...updatedFields } = productData;
    if (!id) {
      throw new Error("Product ID is required for update.");
    }
    const res = await api.put(`/api/Products/${id}`, updatedFields);
    return res.data;
  }
);

// // Delete
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.product.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex((u) => u.id === action.payload.id);
        if (index >= 0) state.product[index] = action.payload;
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.product = state.product.filter((u) => u.id !== action.payload);
      });
  },
});
export default productSlice.reducer;