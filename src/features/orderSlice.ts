import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";

// ---------------------------
// Interfaces & Types
// ---------------------------
export interface Order {
  id: string;
  OrderDate: string;
  price: number;
}

export interface OrderItems {
  itemId: string;
  orderId: string;
  name:string
  price: number;
  quantity:number;
}

// interface ProductResponse {
//   items: Product[];
//   totalItems: number;
//   pageNumber: number;
//   pageSize: number;
// }

interface OrderState {
  order: Order[];
  loading: boolean;
  error: string | null;
 
}

// ---------------------------
// Initial State
// ---------------------------
const initialState: OrderState = {
  order: [],
  loading: false,
  error: null,
 
};

// ---------------------------
// Async Thunks
// ---------------------------

// 🟦 Fetch Products (with pagination & filters)
export const fetchProducts = createAsyncThunk<Order[]>(
  "orders/fetchOrders",
  async () => {
    //_, { getState }
    //const state: any = getState();
    // const { searchQuery, sort, page, pageSize } = state.products;

    // const params: any = {
    //   q: searchQuery || "",
    //   sort: sort || "",
    //   page,
    //   pageSize,
    // };

    const res = await api.get("https://localhost:7171/api/Order");
    console.log("fetchOrders -> response", res.data);
    return res.data;
  }
);

// 🟩 Add Product
// export const addProduct = createAsyncThunk<Order, Omit<Order, "id">>(
//   "products/addProduct",
//   async (newProduct) => {
//     const res = await api.post("/api/Products", newProduct);
//     return res.data;
//   }
// );

// 🟨 Update Product
// export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
//   "products/updateProduct",
//   async (productData) => {
//     const { id, ...updatedFields } = productData;
//     if (!id) throw new Error("Product ID is required for update.");

//     const res = await api.put(`/api/Products/${id}`, updatedFields);
//     return res.data;
//   }
// );

// 🟥 Delete Product
// export const deleteProduct = createAsyncThunk<string, string>(
//   "products/deleteProduct",
//   async (id) => {
//     if (!id) throw new Error("Product ID is required for delete.");
//     await api.delete(`/api/Products/${id}`);
//     return id; // ✅ just return the id, no need to return full response
//   }
// );

// ---------------------------
// Slice
// ---------------------------
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // 🔍 Filters & Sorting
    // sortByPrice(state, action: PayloadAction<string>) {
    //   state.sort = action.payload;
    //   state.page = 1;
    // },
    // filterBySearch(state, action: PayloadAction<string>) {
    //   state.searchQuery = action.payload;
    //   state.page = 1;
    // },
    // clearFilters(state) {
    //   state.sort = "";
    //   state.searchQuery = "";
    //   state.page = 1;
    // },

    // // 📄 Pagination
    // setPage(state, action: PayloadAction<number>) {
    //   state.page = action.payload;
    // },
    // setPageSize(state, action: PayloadAction<number>) {
    //   state.pageSize = action.payload;
    //   state.page = 1; // reset to first page when page size changes
    // },
  },

  extraReducers: (builder) => {
    builder
      // 🟦 Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        // state.totalCount = action.payload.totalItems;
        // state.page = action.payload.pageNumber;

        // ✅ FIX: Only override if backend sends pageSize
       // state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

      // 🟩 Add
    //   .addCase(addProduct.fulfilled, (state, action) => {
    //     state.product.push(action.payload);
    //   })

      // 🟨 Update
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     const index = state.product.findIndex((p) => p.id === action.payload.id);
    //     if (index >= 0) state.product[index] = action.payload;
    //   })

      // 🟥 Delete
    //   .addCase(deleteProduct.fulfilled, (state, action) => {
    //     state.product = state.product.filter((p) => p.id !== action.payload);
    //   });
  },
});

// ---------------------------
// Exports
// ---------------------------
// export const {
//   sortByPrice,
//   filterBySearch,
//   clearFilters,
//   setPage,
//   setPageSize,
// } = productSlice.actions;

export default orderSlice.reducer;
