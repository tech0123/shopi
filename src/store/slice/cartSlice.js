import { calcInitialValues } from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProductsData: [],
  selectedProducts: [],
  subTotal: 0,
  calcValues: calcInitialValues,
  modeOfPayment: "cash",
  searchCustomer: '',
  selectedCustomer: {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setAllProductsData: (state, action) => {
      state.allProductsData = action.payload;
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    setSubTotal: (state, action) => {
      state.subTotal = action.payload;
    },
    setCalcValues: (state, action) => {
      state.calcValues = action.payload;
    },
    setModeOfPayment: (state, action) => {
      state.modeOfPayment = action.payload;
    },
    setSearchCustomer: (state, action) => {
      state.searchCustomer = action.payload;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  }
});

export const {
  setAllProductsData,
  setSelectedProducts,
  setCalcValues,
  setSubTotal,
  setModeOfPayment,
  setSearchCustomer,
  setSelectedCustomer
} = cartSlice.actions;

export default cartSlice.reducer;
