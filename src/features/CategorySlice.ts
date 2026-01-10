import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";


// ---------------------------
// Interfaces & Types
// ---------------------------

export interface categoryDto{
id:number;
name:string;
}


interface categoryState {
   category:categoryDto[];
    message:string;
  loading: boolean;
  error: string | null;
 
}


// ---------------------------
// Initial State
// ---------------------------
const initialState: categoryState = {
  message: '',
  category:[],
  
  loading: false,
  error: null,

 
};

// ---------------------------
// Async Thunks
// ---------------------------
export const GetCategory = createAsyncThunk(
  "category/GetCategory",
  async (
     ) => {
         try{
        const res=await  api.get("/api/Category");
        console.log(`category data `+res.data)
        return res.data
         }
         catch(err:any){
          const res=err.response;
          console.log(res)
         }
     });


// ---------------------------
// Slice
// ---------------------------
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearMessages(state){
      state.error=null;
      state.message="";
      
    }
  },

  extraReducers: (builder) => {
    builder
   
      .addCase(GetCategory.fulfilled, (state, action) => {
        state.message='Successfully fetched categories';
        state.loading=false;
        state.category.push(...action.payload);
      }) .addCase(GetCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      }) 
      .addCase(GetCategory.rejected, (state) => {
        state.loading = false;
        state.error = "some thing went wrong" ;
        
      })
      
    

  },
});

// ---------------------------
// Exports
// ---------------------------
export const {clearMessages}=categorySlice.actions;
export default categorySlice.reducer;
