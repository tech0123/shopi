import { calcInitialValues } from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProductList: [],
  selectedProducts: [],
  subTotal: 0,
  calcValues: calcInitialValues
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setAllProductList: (state, action) => {
      state.allProductList = action.payload;
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
    setSubTotal: (state, action) => {
      state.subTotal = action.payload;
    },
    setCalcValues: (state, action) => {
      state.calcValues = action.payload;
    }
  }
});

export const {
  setProductLoading,
  setAllProductList,
  setSelectedProducts,
  setCalcValues,
  setSubTotal
} = cartSlice.actions;

export default cartSlice.reducer;
