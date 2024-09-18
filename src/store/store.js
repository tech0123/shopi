import { combineReducers, configureStore } from "@reduxjs/toolkit";
import product from "./slice/productSlice";
import employee from "./slice/employeeSlice";
import productItem from "./slice/productItemSlice";
import common from "./slice/commonSlice";
import manufacturer from "./slice/manufacturerSlice";
import purchase from "./slice/purchaseSlice";

const reducers = combineReducers({
  product,
  employee,
  productItem,
  common,
  manufacturer,
  purchase
});

const store = configureStore({
  reducer: reducers
});

export { store };
