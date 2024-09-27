import { calcInitialValues } from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProductsData: [],
  selectedProducts: [],
  subTotal: 0,
  calcValues: calcInitialValues,
  modeOfPayment:"cash",
  searchCustomer: '',
  selectedCustomer: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
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
  setProductLoading,
  setAllProductsData,
  setSelectedProducts,
  setCalcValues,
  setSubTotal,
  setModeOfPayment,
  setSearchCustomer,
  setSelectedCustomer
} = cartSlice.actions;

export default cartSlice.reducer;
