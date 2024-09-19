import {
  calcInitialValues,
  roastError,
  successMsg
} from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  productLoading: false,
  allProductList: [],
  productDialog: false,
  productData: [],
  deleteProductDialog: false,
  productImageState: null
};

export const getAllProductList = () => async dispatch => {
  try {
    dispatch(setProductLoading(true));
    const response = await axios.get(`/api/products/getProduct`);
    const { data, msg, err } = response.data;

    if (err === 0) {
      dispatch(setAllProductList(data));
      return data;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const productItemSlice = createSlice({
  name: "productItem",
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setAllProductList: (state, action) => {
      state.allProductList = action.payload;
    },
    setProductDialog: (state, action) => {
      state.productDialog = action.payload;
    },
    setProductData: (state, action) => {
      state.productData = action.payload;
    },
    setDeleteProductDialog: (state, action) => {
      state.deleteProductDialog = action.payload;
    },
    setProductImageState: (state, action) => {
      state.productImageState = action.payload;
    }
  }
});

export const {
  setProductLoading,
  setAllProductList,
  setProductDialog,
  setProductData,
  setDeleteProductDialog,
  setProductImageState
} = productItemSlice.actions;

export default productItemSlice.reducer;
