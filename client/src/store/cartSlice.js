import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  cart:[]
};

const cartslice = createSlice({
     name:"cartitem",
     initialState:initialValue,
     reducers:{
          handleaddcart : (state,action) =>{
               state.cart = [...action.payload]
          }

     }
})

export const{handleaddcart} = cartslice.actions

export default cartslice.reducer