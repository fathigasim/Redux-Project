import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";



// ---------------------------
// Interfaces & Types
// ---------------------------
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl:string
}
export interface ProductProc {
  id: string;
  name: string;
  price: number;
  stock:number;
  updatedAt:Date
     
     
}
interface ProductResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface ProductProcResponse {
  productProcDto: ProductProc[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

interface ProductState {
  products: Product[];
  //
  productProcDto: ProductProc[];
  totalRecords: number;
  pageProcNumber: number;
  pageProcSize: number;
  searchTerm:string|null;
  minPrice: string | null;
  maxPrice : string |null;
  //
  loading: boolean;
  error: string |string []| null;
  success: string | null;
  sort: string;
  searchQuery: string | number | null;
  category:number;
  page: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
    formErrors: { name?: string; price?: string; image?:File|null  };
}

// ---------------------------
// Initial State
// ---------------------------
const initialState: ProductState = {
  products: [],
  productProcDto:[],
  searchTerm:"",

  minPrice: null,
  maxPrice: null,
  pageProcNumber:1,
  pageProcSize:3,
  totalRecords:0,
  loading: false,
  error: null,
  success: null,
  sort: localStorage.getItem("sort") || "",
  searchQuery: localStorage.getItem("searchQuery") || "",
  category:0,
  
  page: Number(localStorage.getItem("page")) || 1,
  pageSize: 6,
  totalCount: 0,
  formErrors: {},
};

interface FetchProductsParams {
  page?: number;
  sort?: string;
  searchQuery?: string | null;
  category?: number | null;
}
interface FetchProductsProcParams {
  page?: number;
  minPrice?: number| null;
  maxPrice?: string| null;
  searchTerm?: string | null;
  pageSize?:number;
}

// ---------------------------
// Async Thunks
// ---------------------------
export const fetchProducts = createAsyncThunk<ProductResponse, FetchProductsParams | undefined>(
  "products/fetchProducts",
  async (overrideParams, { getState }) => {
    const state: any = getState();
    const { searchQuery,category ,sort, page, pageSize } = state.products;

    const params = {
      q: overrideParams?.searchQuery ?? searchQuery ?? "",
      category: overrideParams?.category ?? category ?? 0,
      sort: overrideParams?.sort ?? sort ?? "",
      page: overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    const res = await api.get("/api/Products", { params});
    return res.data;
  }
);

export const fetchProcProducts = createAsyncThunk<ProductProcResponse, FetchProductsProcParams | undefined>(
  "products/fetchProcProducts",
  async (overrideParams, { getState }) => {
    const state: any = getState();
    const { searchTerm,minPrice,maxPrice ,pageProcNumber, pageProcSize } = state.products;

    const params = {
      searchTerm: overrideParams?.searchTerm ?? searchTerm ?? "",
      minPrice: overrideParams?.minPrice ?? minPrice ?? null,
      maxPrice: overrideParams?.maxPrice ?? maxPrice ?? null,
      page: overrideParams?.page ?? pageProcNumber ?? 1,
      pageProcSize,
    };

    const res = await api.get("/api/Test", { params });
    return res.data;
  }
);

export const fetchAdminProducts = createAsyncThunk<ProductResponse, FetchProductsParams | undefined>(
  "products/fetchAdminProducts",
  async (overrideParams, { getState }) => {
    const state: any = getState();
    const { searchQuery, sort, page, pageSize } = state.products;

    const params = {
      q: overrideParams?.searchQuery ?? searchQuery ?? "",
      sort: overrideParams?.sort ?? sort ?? "",
      page: overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    const res = await api.get("/api/Products/AdminProduct", { params });
    return res.data;
  }
);


export const fetchSuggestions = createAsyncThunk(
  "products/fetchSuggestions",
  async (query: string) => {
    const res = await api.get(`/api/products/suggest?query=${query}`);
    return res.data; // e.g. a list of top 5 names
  }
);


export const addProduct = createAsyncThunk<
  { product: Product; message: string },
  // { name: string; price: number },
  { formData: FormData },
  { rejectValue: Record<string, string[] | string> }
>(
  "products/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/Products", formData, {headers :{ 'Content-Type':'multipart/form-data'}} );
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
    const res = await api.put(`/Products/${id}`, updatedFields);
    return res.data;
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
      await api.delete(`/api/products/${id}`);
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error=null;
        state.success=null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.hasPreviousPage = action.payload.hasPreviousPage;
        state.hasNextPage = action.payload.hasNextPage;
        state.page = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

       .addCase(fetchProcProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productProcDto = action.payload.productProcDto;
        state.totalRecords = action.payload.totalRecords;
        state.pageProcNumber = action.payload.pageNumber;
        state.pageProcSize = action.payload.pageSize || state.pageProcSize;
      })
      .addCase(fetchProcProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products procedure";
      })

      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error=null;
        state.success=null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items;
        state.totalCount = action.payload.totalItems;
        state.page = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize || state.pageSize;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching products";
      })

      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.product);
        state.success = action.payload.message;
        state.error = null;
        state.loading=false;
      })
     .addCase(addProduct.rejected, (state, action) => {
  state.loading = false;
  state.success = null;
  state.formErrors = {}; // reset previous validation errors

  const payload = action.payload as
    | { Name?: string[]; Price?: string[],Image:File[] }
    | { general?: string }
    | undefined;

  if (payload && ('Name' in payload || 'Price' in payload ||'Image' in payload)) {
    state.error = null;
    state.formErrors = {
      name: Array.isArray(payload.Name) ? payload.Name[0] : undefined,
      price: Array.isArray(payload.Price) ? payload.Price[0] : undefined, 
    image: Array.isArray(payload.Image) ? payload.Image[0] : undefined,};
  } else if (payload && 'general' in payload) {
    state.error = payload.general as string;
  } else {
    state.error = action.error?.message || "Error adding product";
  }
})


      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) state.products[index] = action.payload;
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
