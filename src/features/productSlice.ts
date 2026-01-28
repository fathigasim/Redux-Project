import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";



// ---------------------------
// Interfaces & Types
// ---------------------------
export interface Product {
  id: string;
  name: string;
  price: number;
  image: File | null;
  imageUrl:string
  stock:number;
  categoryId:number;
}

interface ProductResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


interface ProductState {
  products: Product[];
  totalRecords: number;
  searchTerm:string|null;
  minPrice: string | null;
  maxPrice : string |null;
  //
  loading: boolean;
  error: string |string []| null;
  message: string | null;
  success: string | null;
  sort: string;
  searchQuery: string | number | null;
  searchCategory:string|null;
  page: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  formErrors: { name?: string; price?: string; image?:File|null,stock?:number|null }; };


// ---------------------------
// Initial State
// ---------------------------
const initialState: ProductState = {
  products: [],
  
  searchTerm:"",
  minPrice: null,
  maxPrice: null,

  totalRecords:0,
  loading: false,
  message: null,
  error: null,
  success: null,
  sort: localStorage.getItem("sort") || "",
  searchQuery: localStorage.getItem("searchQuery") || "",
  searchCategory: localStorage.getItem("searchCategory") || "",
  
  page: Number(localStorage.getItem("page")) || 1,
  pageSize: 8,
  totalCount: 0,
  formErrors: {},
};

interface FetchProductsParams {
  page?: number;
  sort?: string;
  searchQuery?: string | null;
  searchCategory?: string | null;
}


// ---------------------------
// Async Thunks
// ---------------------------
export const fetchProducts = createAsyncThunk<ProductResponse, FetchProductsParams | undefined>(
  "products/fetchProducts",
  async (overrideParams, { getState }) => {
    const state: any = getState();
    const { searchQuery, searchCategory, sort, page, pageSize } = state.products;

    const params = {
      q: overrideParams?.searchQuery ?? searchQuery ?? "",
      category: overrideParams?.searchCategory ?? searchCategory ?? "",
      sort: overrideParams?.sort ?? sort ?? "",
      page: overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    const res = await api.get("/Products", { params});
    return res.data;
  }
);




export const fetchSuggestions = createAsyncThunk(
  "products/fetchSuggestions",
  async (query: string) => {
    const res = await api.get(`/products/suggest?query=${query}`);
    return res.data; // e.g. a list of top 5 names
  }
);


export const addProduct = createAsyncThunk<
  { message: string },
  // { name: string; price: number },
  { formData: FormData },
  { rejectValue: Record<string, string[] | string> }
>(
  "products/addProduct",
  async  (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/Products", formData, {headers :{ 'Content-Type':'multipart/form-data'}} );
      return {
       // product: res.data.product,
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


export const updateProduct = createAsyncThunk<
  { message: string},
  { id: string; formData: FormData },
  { rejectValue: Record<string, string[] | string> }
>(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/Products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err: any) {
      const res = err.response;
      if (res?.status === 400 && res.data?.errors) {
        return rejectWithValue(res.data.errors);
      }
      if (res?.data?.message) {
        return rejectWithValue({ general: res.data.message });
      }
      return rejectWithValue({ general: "Error updating product" });
    }
  }
);
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue({ message: 'Product ID is required for delete' });
    }

    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue({ 
        message: error instanceof Error ? error.message : 'Failed to delete product'
      });
    }
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
    
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.hasPreviousPage = action.payload.hasPreviousPage;
        state.hasNextPage = action.payload.hasNextPage;
        state.page = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize || state.pageSize;
      })
        .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error=null;
        state.success=null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

    

    
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        //state.products.push(action.payload.product);
        state.success = action.payload.message;
        state.error = null;
        state.loading=false;
      })
     .addCase(addProduct.rejected, (state) => {
  state.loading = false;
  state.success = null;

})


      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        // const index = state.products.findIndex((p) => p.id === action.payload.id);
        // if (index >= 0) state.products[index] = action.payload;
        state.message = action.payload.message;
        state.error = null;
        state.loading=false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.formErrors = {}; // reset previous validation errors
      })
      .addCase(updateProduct.rejected, (state) => {
        state.loading = false;
        state.success = null;
      })
     
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
    }});
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
