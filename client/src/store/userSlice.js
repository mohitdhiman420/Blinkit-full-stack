import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    userDetails: (state, action) => {
      return (state = action.payload);
    },

    logout: (state, action) => {
      return initialValue;
    },

    updateavatar: (state, action) => {
     state.avatar = action.payload;
    },
  },
});



export const { userDetails, logout, updateavatar } = userSlice.actions;

export default userSlice.reducer;
