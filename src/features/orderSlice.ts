import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";

// ---------------------------
// Interfaces & Types
// ---------------------------

export interface OrderItems {
  itemId: string;
  orderId: string;
  name:string
  price: number;
  quantity:number;
}
export interface Order {
  id: string;
  orderDate: string;
  orderItems: OrderItems[];
  totalAmount: number;
}

interface  OrderResponse {
  items: Order[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
}


// interface OrderItemState{
//   orderItems:OrderItems[]
// }
// interface ProductResponse {
//   items: Product[];
//   totalItems: number;
//   pageNumber: number;
//   pageSize: number;
// }

interface OrderState {
  order: Order[];
  // orderItems:OrderItems[],
  loading: boolean;
  error: string | null;
   page: number;
  pageSize: number;
  totalCount: number;
}

interface FetchOrdersParams {
  page?: number;
  // sort?: string;
  // searchQuery?: string | null;
}
// ---------------------------
// Initial State
// ---------------------------
const initialState: OrderState = {
  order: [],
  // orderItems:[],
  loading: false,
  error: null,
  page:1,
  pageSize:3,
  totalCount:0
 
};

// ---------------------------
// Async Thunks
// ---------------------------

// 🟦 Fetch Products (with pagination & filters)
export const fetchOrders= createAsyncThunk<OrderResponse,FetchOrdersParams>(
  "orders/fetchOrders",
  async (overrideParams,{ getState }) => {
    
     const state: any = getState();
     const { page, pageSize } = state.orders;

    const params: any = {
     // q: searchQuery || "",
      //sort: sort || "",
     page:  overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    const res = await api.get("/api/Order",{ params });
    console.log("fetchOrders -> response", res.data);
    return res.data as OrderResponse;
  }
);
export const OrderByDate= createAsyncThunk<OrderResponse,string>(
  "orders/report/DatedOrders",
  async (date:string) => {
    //_, { getState }
    //const state: any = getState();
    // const { searchQuery, sort, page, pageSize } = state.products;

    // const params: any = {
    //   q: searchQuery || "",
    //   sort: sort || "",
    //   page,
    //   pageSize,
    // };

    const res = await api.get(`/api/Order/${date}`);
    console.log("fetchOrders -> response", res.data);
    return await res.data as OrderResponse;
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
     setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      localStorage.setItem("page", action.payload.toString());
    },
  },

  extraReducers: (builder) => {
    builder
      // 🟦 Fetch
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.items;
       
         state.totalCount = action.payload.totalItems;
        state.page = action.payload.pageNumber;

        // ✅ FIX: Only override if backend sends pageSize
       // state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })
      .addCase(OrderByDate.fulfilled, (state, action) => {
        state.order=action.payload.items;
        state.loading=false;
        state.page=action.payload.pageNumber;
        state.pageSize=action.payload.pageSize;
        state.totalCount=action.payload.totalItems;
      }) .addCase(OrderByDate.pending, (state) => {
        state.loading = true
        state.error = null;
        state.order = [];
      }) 
      
      .addCase(OrderByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching orders";
      })

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
 export const {
//   sortByPrice,
//   filterBySearch,
//   clearFilters,
  setPage,
//   setPageSize,
 } = orderSlice.actions;

export default orderSlice.reducer;
