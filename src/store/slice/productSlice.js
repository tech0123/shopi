import { calcInitialValues, roastError } from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProductList: [],
  selectedProducts: [],
  subTotal: 0,
  calcValues: calcInitialValues
};

export const addProduct = payload => async dispatch => {
  try {
    dispatch(setProductLoading(true));
    const response = await axios.get(`/api/products/getProduct`, payload);
    const { data, msg, err } = response.data;

    if (err === 0) {
      successMsg(msg);
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

export const productSlice = createSlice({
  name: "productSliceName",
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
} = productSlice.actions;

export default productSlice.reducer;
