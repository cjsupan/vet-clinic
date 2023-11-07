import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import userReducer from "./slices/userSlice";
import clientReducer from "./slices/clientSlice";
import appointmentReducer from "./slices/appointmentSlice";
import utilityReducer from "./slices/utilitySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    appointment: appointmentReducer,
    utility: utilityReducer,
  },
  middleware: [thunkMiddleware],
});

export default store;
