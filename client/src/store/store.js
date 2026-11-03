import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import categoryreducer from './categorySlice'
import cartreducer from './cartSlice'
import addressreducer from "./addressSlice"
import orderreducer from "./orderSlice"

export const store = configureStore({
     reducer:{
          user:userReducer,
          category:categoryreducer,
          cartitem:cartreducer,
          address:addressreducer,
          order:orderreducer,
     }
})
