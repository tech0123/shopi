import { combineReducers, configureStore } from "@reduxjs/toolkit";
import product from "./slice/productSlice";
import employee from "./slice/employeeSlice";
import productItem from "./slice/productItemSlice";
import common from "./slice/commonSlice";

const reducers = combineReducers({
  product,
  employee,
  productItem,
  common
});

const store = configureStore({
  reducer: reducers
});

export { store };
