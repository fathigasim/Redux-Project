import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";
import type { ActionDispatch } from "react";

// ---------------------------
// Interfaces & Types
// ---------------------------

export interface basketInput{
prodId:string;
inputQnt:number;
}

export interface basketRemove{
productId:string;
quantity:number;
}
 export  interface basketItems{
     id:number;
  quantity:number;
   productId:string;
  productName:string;
  image:string;

  price:number;
   }
interface basketState {
   items:basketItems[];
   message:string;
  loading: boolean;
  error: string | null;
 
}


// ---------------------------
// Initial State
// ---------------------------
const initialState: basketState = {
  message: '',
  items:[],
  loading: false,
  error: null,

 
};

// ---------------------------
// Async Thunks
// ---------------------------
export const GetBasket = createAsyncThunk(
  "basket/GetBasket",
  async (
     ) => {
         try{
        const res=await  api.get("/api/Basket/BasketItems",{withCredentials:true});
        console.log(res.data)
        return res.data
         }
         catch(err:any){
          const res=err.response;
          console.log(res)
         }
     });
export const GetBasketSummery = createAsyncThunk(
  "basket/GetBasketSummery",
  async (
     ) => {
         try{
        const res=await  api.get("/api/Basket/BasketSummery",{withCredentials:true});
        console.log(res.data)
        return res.data
         }
         catch(err:any){
          const res=err.response;
          console.log(res)
         }
     });

     export const RemoveFromBasket = createAsyncThunk(
  "basket/RemoveFromBasket",
  async (rmbasketitem:basketRemove) => {
      
         try{
        const res=await  api.delete(`/api/Basket/RemoveFromBasket?productId=${rmbasketitem.productId}&&quantity=${rmbasketitem.quantity}`);
        console.log(res.data)
        return res.data
         }
         catch(err:any){
          const res=err.response;
          console.log(res)
         }
     });
// 🟩 Add Product
export const addToBasket = createAsyncThunk(
  "basket/addToBasket",
  async ({prodId,inputQnt}:basketInput,{rejectWithValue}
     ) => {
        try{
    const res = await api.post("/api/Basket/", {prodId,inputQnt});
    return res.data;
    }
    catch(err:any){
      const res= err.response;
console.log(`response error ${res?.data}`)
      return rejectWithValue(res?.data || "Error adding to basket");
      
    }
  }
);

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
const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
   
  },

  extraReducers: (builder) => {
    builder
   
      .addCase(addToBasket.fulfilled, (state, action) => {
        state.message=action.payload;
        state.loading=false;
        state.items=action.payload.items;
      }) .addCase(addToBasket.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      }) 
      .addCase(addToBasket.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string ;
        
      })
      .addCase(GetBasket.fulfilled, (state, action) => {
        state.items=action.payload;
        state.loading=false;
        
      })
       .addCase(GetBasket.pending, (state) => {
      
        state.loading=true;
        
      })

        .addCase(GetBasket.rejected, (state) => {
      
        state.loading=false;
        state.error="Error getting data";
        
      })
       .addCase(RemoveFromBasket.fulfilled, (state,action) => {
      
        state.loading=false;
        state.items=action.payload;
        state.error=null;
        
      })
      .addCase(RemoveFromBasket.pending, (state) => {
      
        state.loading=true;
     
        state.error=null;
        
      })
      .addCase(RemoveFromBasket.rejected, (state) => {
      
        state.loading=false ;
     
        state.error="some error occured";
        
      })
      
    

  },
});

// ---------------------------
// Exports
// ---------------------------

export default basketSlice.reducer;
