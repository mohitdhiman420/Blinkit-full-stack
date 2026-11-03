import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  addressList:[]
};

const addressSlice = createSlice({
     name:"address",
     initialState:initialValue,
     reducers:{
          handleaddaddress : (state,action) =>{
               state.addressList = [...action.payload]
          }

     }
})

export const{handleaddaddress} = addressSlice.actions

export default addressSlice.reducer