import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";


interface OrderItems {
  productName:string;
  productQuantity:number;
  productPrice:number;
}
interface OrderTotal {
  orderId:number;
  total:number
  product:string
  items: OrderItems[]
  
}

interface OrderTotalState{
  items:OrderTotal[]
  page: number;
  pageSize: number;
  totalCount: number;
  loading:boolean,
  error:string | null
  
}

interface ResponseOrderTotalState{
  items:OrderTotal[];
  PageNumber:number;
  pageSize:number;
  totalItems:number;
 
}


const initialState:OrderTotalState={

   items: [] ,
   page:1,
   pageSize:5,
   totalCount:0,
  loading:false,
  error: null
}
interface FetchOrderstatParams {
  page: number;
  // sort?: string;
  // searchQuery?: string | null;
}
export const fetchOrderStats= createAsyncThunk<ResponseOrderTotalState,FetchOrderstatParams>(
  "orders/orderStats",
  async ( overrideParams,{ getState }) => {
   
     const state: any = getState();
     const { page, pageSize } = state.orderstats;

   const params: any = {
    // q: searchQuery || "",
      //sort: sort || "",
     page:  overrideParams?.page ?? page ?? 1,
      pageSize,
    };

    // const res = await api.get("/api/Order",{ params });
     const res = await api.get("/api/Order/OrderSum",{ params });
    console.log("fetchOrderStats -> response", res.data);
    return res.data as ResponseOrderTotalState;
  }
);

const orderstatSlice = createSlice({
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
      .addCase(fetchOrderStats.pending, (state) => {
         state.error=null;
         state.loading=true;
      }).addCase(fetchOrderStats.fulfilled,(state,action)=>{
        state.error=null;
        state.loading=false;
        state.items=action.payload.items;
        state.page=action.payload.PageNumber;
        state.pageSize=action.payload.pageSize;
        state.totalCount=action.payload.totalItems;

      }
    ).addCase(fetchOrderStats.rejected,(state,action)=>{
        state.error=action.error.message||"some went wrong";
        state.loading=false;
    }

)
    
    }
    })

    export const {
    //   sortByPrice,
    //   filterBySearch,
    //   clearFilters,
     setPage,
    //   setPageSize,
     } = orderstatSlice.actions;
    
    export default orderstatSlice.reducer;