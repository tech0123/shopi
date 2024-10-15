import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cart from "./slice/cartSlice";
import sales from "./slice/salesSlice";
import report from "./slice/reportSlice";
import common from "./slice/commonSlice";
import employee from "./slice/employeeSlice";
import purchase from "./slice/purchaseSlice";
import customer from "./slice/customerSlice";
import attendance from "./slice/attendanceSlice";
import productItem from "./slice/productItemSlice";
import manufacturer from "./slice/manufacturerSlice";

const reducers = combineReducers({
  employee,
  productItem,
  common,
  manufacturer,
  purchase,
  cart,
  attendance,
  customer,
  sales,
  report
});

const store = configureStore({
  reducer: reducers
});

export { store };
