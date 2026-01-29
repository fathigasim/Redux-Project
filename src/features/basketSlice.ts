import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";


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
   basketSummery:basketSummery;
   message:string;
  loading: boolean;
  error: string | null;
 
}

interface basketSummery{
     basketCount : number;

   basketTotal:number;
}
// ---------------------------
// Initial State
// ---------------------------
const initialState: basketState = {
  message: '',
  basketSummery:{
    basketCount:0,
    basketTotal:0
  },
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
        const res=await  api.get("/Basket/BasketItems",{withCredentials:true});
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
        const res=await  api.get("/Basket/BasketSummery",{withCredentials:true});
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
        const res=await  api.delete(`/Basket/RemoveFromBasket?productId=${rmbasketitem.productId}&&quantity=${rmbasketitem.quantity}`);
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
    const res = await api.post("/Basket/", {prodId,inputQnt});
    return res.data;
    }
    catch(err:any){
      const res= err.response;
console.log(`response error ${res?.data}`)
      return rejectWithValue(res?.data || "Error adding to basket");
      
    }
  }
);
//basket summery
export const BasketSummery = createAsyncThunk<basketSummery,void,{rejectValue:string}>(
  "basket/BasketSummery",
  async ( _,{rejectWithValue}
     ) => {
        try{
    const res = await api.get("/Basket/BasketSummery");
    console.log();
    return res.data as basketSummery;
        }
        catch(err:any){
      const res= err.response;
console.log(`response error ${res?.data}`)
      return rejectWithValue(res?.data || " basket summery not available");}});
//clear basket
export const ClearBasket = createAsyncThunk(
  "basket/ClearBasket",
  async (message,{rejectWithValue}
     ) => {
        try{
    const res = await api.delete("/Basket/ClearBasket");
    console.log();
    return message=res.data;
    }
    catch(err:any){
      const res= err.response;
console.log(`response error ${res?.data}`)
      return rejectWithValue(res?.data || "Error adding to basket");
      
    }
  }
);

export const BasketRemove = createAsyncThunk(
"basket/RemoveBasket",
async (message,{rejectWithValue}
     ) => {
        try{
    const res = await api.delete("/Basket/RemoveBasket");
    console.log();
    return message=res.data;
    }
    catch(err:any){
      const res= err.response;
console.log(`response error ${res?.data}`)
      return rejectWithValue(res?.data || "not able to remove basket");
      
    }
  }
)
// ---------------------------
// Slice
// ---------------------------
const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    clearMessages(state){
      state.error=null;
      state.message="";
      
    }
  },

  extraReducers: (builder) => {
    builder
   
      .addCase(addToBasket.fulfilled, (state, action) => {
        state.message=action.payload;
        state.loading=false;
        // state.items.push(action.payload.items);
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
       .addCase(RemoveFromBasket.fulfilled, (state) => {
      
        state.loading=false;
     
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
      .addCase(ClearBasket.fulfilled, (state,action) => {
      
        state.loading=false;
        state.items=[];
        state.error=null;
        state.message=action.payload
      })
      .addCase(ClearBasket.pending, (state) => {
      
        state.loading=true;
       
        state.error=null;
     
        
      })
        .addCase(ClearBasket.rejected, (state) => {
      
        state.loading=false;
      
      })
       .addCase(BasketSummery.fulfilled, (state,action) => {
      
        state.loading=false;
        state.basketSummery.basketCount=action.payload.basketCount;
        state.basketSummery.basketTotal=action.payload.basketTotal;
        state.error=null;
       
      })
       .addCase(BasketRemove.fulfilled, (state, action) => {
        state.message=action.payload;
        state.loading=false;
       
      }) 
      .addCase(BasketRemove.rejected, (state) => {
      // state.message=action.payload;
        state.loading=false;
       
      }) 
    

  },
});

// ---------------------------
// Exports
// ---------------------------
export const {clearMessages}=basketSlice.actions;
export default basketSlice.reducer;
