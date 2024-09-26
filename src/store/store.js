import { combineReducers, configureStore } from "@reduxjs/toolkit";
import employee from "./slice/employeeSlice";
import productItem from "./slice/productItemSlice";
import common from "./slice/commonSlice";
import manufacturer from "./slice/manufacturerSlice";
import purchase from "./slice/purchaseSlice";
import cart from "./slice/cartSlice";
import attendance from "./slice/attendanceSlice";
import customer from "./slice/customerSlice";

const reducers = combineReducers({
  employee,
  productItem,
  common,
  manufacturer,
  purchase,
  cart,
  attendance,
  customer,
});

const store = configureStore({
  reducer: reducers
});

export { store };
