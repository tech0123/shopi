import { combineReducers, configureStore } from "@reduxjs/toolkit";
import product from "./slice/productSlice";
import employee from "./slice/employeeSlice";

const reducers = combineReducers({
  product,
  employee
});

const store = configureStore({
  reducer: reducers
});

export { store };
