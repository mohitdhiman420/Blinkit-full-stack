import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  allcategory: [],
  allsubategory: [],
  products: [],
  loadingCategory: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState: initialValue,
  reducers: {
    setallcategory: (state, action) => {
      state.allcategory = [...action.payload];
    },

    setallsubcategory: (state, action) => {
      state.allsubategory = [...action.payload];
    },

    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
  },
});

export const { setallcategory, setallsubcategory,setLoadingCategory  } = categorySlice.actions;

export default categorySlice.reducer;
