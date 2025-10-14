import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";

// ---------------------------
// Interfaces & Types
// ---------------------------
export interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductResponse {
  items: Product[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
}

interface ProductState {
  product: Product[];
  loading: boolean;
  error: string |string []| null;
  success: string | null;
  sort: string;
  searchQuery: string | number | null;
  page: number;
  pageSize: number;
  totalCount: number;
    formErrors: { name?: string; price?: string };
}

// ---------------------------
// Initial State
// ---------------------------
const initialState: ProductState = {
  product: [],
  loading: false,
  error: null,
  success: null,
  sort: localStorage.getItem("sort") || "",
  searchQuery: localStorage.getItem("searchQuery") || "",
  page: Number(localStorage.getItem("page")) || 1,
  pageSize: 2,
  totalCount: 0,
  formErrors: {},
};

interface FetchProductsParams {
  page?: number;
  sort?: string;
  searchQuery?: string | number;
}

// ---------------------------
// Async Thunks
// ---------------------------
export const fetchProducts = createAsyncThunk<ProductResponse, FetchProductsParams | undefined>(
  "products/fetchProducts",
  async (overrideParams, { getState }) => {
    const state: any = getState();
    const { searchQuery, sort, page, pageSize } = state.products;

    const params = {
      q: overrideParams?.searchQuery ?? searchQuery ?? "",
      sort: overrideParams?.sort ?? sort ?? "",
      page: overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    const res = await api.get("/api/Products", { params });
    return res.data;
  }
);

export const addProduct = createAsyncThunk<
  { product: Product; message: string },
  { name: string; price: number },
  { rejectValue: Record<string, string[] | string> }
>(
  "products/addProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/Products", newProduct);
      return {
        product: res.data.product,
        message: res.data.message,
      };
    } catch (err: any) {
      const res = err.response;

      // --- Case 1: ModelState validation errors (from [ApiController]) ---
      if (res?.status === 400 && res.data?.errors) {
        // { errors: { Name: ["..."], Price: ["..."] } }
        return rejectWithValue(res.data.errors);
      }

      // --- Case 2: Backend localized message ---
      if (res?.data?.message) {
        return rejectWithValue({ general: res.data.message });
      }

      // --- Fallback ---
      return rejectWithValue({ general: "Unexpected error" });
    }
  }
);


export const updateProduct = createAsyncThunk<Product, Partial<Product>>(
  "products/updateProduct",
  async (productData) => {
    const { id, ...updatedFields } = productData;
    if (!id) throw new Error("Product ID is required for update.");
    const res = await api.put(`/api/Products/${id}`, updatedFields);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id) => {
    if (!id) throw new Error("Product ID is required for delete.");
    await api.delete(`/api/Products/${id}`);
    return id;
  }
);

// ---------------------------
// Slice
// ---------------------------
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Filters & Sorting
    sortByPrice(state, action: PayloadAction<string>) {
      state.sort = action.payload;
      state.page = 1; // reset page on sort
      localStorage.setItem("sort", action.payload);
      localStorage.setItem("page", "1");
    },
    filterBySearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1; // reset page on search
      localStorage.setItem("searchQuery", action.payload);
      localStorage.setItem("page", "1");
    },
    clearFilters(state) {
      state.sort = "";
      state.searchQuery = "";
      state.page = 1;
      localStorage.removeItem("sort");
      localStorage.removeItem("searchQuery");
      localStorage.setItem("page", "1");
    },
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      localStorage.setItem("page", action.payload.toString());
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
      localStorage.setItem("page", "1");
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.items;
        state.totalCount = action.payload.totalItems;
        state.page = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.product.push(action.payload.product);
        state.success = action.payload.message;
        state.error = null;
        state.loading=false;
      })
     .addCase(addProduct.rejected, (state, action) => {
  state.loading = false;
  state.success = null;
  state.formErrors = {}; // reset previous validation errors

  const payload = action.payload as
    | { Name?: string[]; Price?: string[] }
    | { general?: string }
    | undefined;

  if (payload && ('Name' in payload || 'Price' in payload)) {
    state.error = null;
    state.formErrors = {
      name: Array.isArray(payload.Name) ? payload.Name[0] : undefined,
      price: Array.isArray(payload.Price) ? payload.Price[0] : undefined,
    };
  } else if (payload && 'general' in payload) {
    state.error = payload.general as string;
  } else {
    state.error = action.error?.message || "Error adding product";
  }
})


      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) state.product[index] = action.payload;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.product = state.product.filter((p) => p.id !== action.payload);
      });
  },
});

// ---------------------------
// Exports
// ---------------------------
export const {
  sortByPrice,
  filterBySearch,
  clearFilters,
  setPage,
  setPageSize,
  clearMessages,
} = productSlice.actions;

export default productSlice.reducer;
