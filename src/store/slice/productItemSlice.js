import { calcInitialValues, roastError } from "@/helper/commonValues";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  productLoading: false,
  allProductList: []
};

export const getAllProductList = () => async dispatch => {
  try {
    dispatch(setProductLoading(true));
    const response = await axios.get(`/api/products/getProduct`);
    const { data, msg, err } = response.data;

    if (err === 0) {
      toast.success(msg);
      dispatch(setAllProductList(data));
      return data;
    } else if (err === 1) {
      toast.error(msg);
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
    }
  }
});

export const {
  setProductLoading,
  setAllProductList
} = productItemSlice.actions;

export default productItemSlice.reducer;
