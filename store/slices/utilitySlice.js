// store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const initialState = {
  sideBarOpen: false,
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    toggle: (state, action) => {
      const { sideBarOpen } = action.payload;
      state.sideBarOpen = sideBarOpen;
    },
  },
});

export const { toggle } = utilitySlice.actions;

export default utilitySlice.reducer;
