import {
  calcInitialValues,
  roastError,
  successMsg
} from "@/helper/commonValues";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const productInitialData = {
  image: "",
  name: "",
  description: "",
  available_quantity: "",
  discount: "",
  tax: "",
  selling_price: "",
  cost_price: ""
};

const initialState = {
  allProductList: [],
  productDialog: false,
  selectedProductData: productInitialData,
  deleteProductDialog: false,
  // productImageState: null,
  productsOptions: []
};

export const productItemSlice = createSlice({
  name: "productItem",
  initialState,
  reducers: {
    setAllProductList: (state, action) => {
      state.allProductList = action.payload;
    },
    setProductDialog: (state, action) => {
      state.productDialog = action.payload;
    },
    setSelectedProductData: (state, action) => {
      state.selectedProductData = action.payload;
    },
    setDeleteProductDialog: (state, action) => {
      state.deleteProductDialog = action.payload;
    },
    // setProductImageState: (state, action) => {
    //   state.productImageState = action.payload;
    // },

    setProductsOptions: (state, action) => {
      state.productsOptions = action.payload;
    }
  },
});

export const {
  setAllProductList,
  setProductDialog,
  setSelectedProductData,
  setDeleteProductDialog,
  // setProductImageState,
  setProductsOptions
} = productItemSlice.actions;

export default productItemSlice.reducer;
