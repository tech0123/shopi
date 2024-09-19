import { combineReducers, configureStore } from "@reduxjs/toolkit";
import employee from "./slice/employeeSlice";
import productItem from "./slice/productItemSlice";
import common from "./slice/commonSlice";
import manufacturer from "./slice/manufacturerSlice";
import purchase from "./slice/purchaseSlice";
import cart from "./slice/cartSlice";

const reducers = combineReducers({
  employee,
  productItem,
  common,
  manufacturer,
  purchase,
  cart
});

const store = configureStore({
  reducer: reducers
});

export { store };
