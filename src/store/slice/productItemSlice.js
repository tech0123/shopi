import {
  calcInitialValues,
  roastError,
  successMsg
} from "@/helper/commonValues";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  productLoading: false,
  allProductList: [],
  productDialog: false,
  productData: [],
  deleteProductDialog: false,
  productImageState: null,
  currentPage: 1,
  pageLimit: 7,
  searchParam: '',
  productsOptions: []
};

export const getAllProductList = createAsyncThunk(
  '/api/crud/get',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/crud/get`, payload);
      const { data, msg, err } = response.data;

      const newObj = {
        list: data?.list ? data?.list : [],
        pageNo: data?.pageNo ? data?.pageNo : '',
        totalRows: data?.totalRows ? data?.totalRows : 0,
      };

      if (err === 0) {
        return (newObj);
      } else if (err === 1) {
        errorMsg(msg);
        return rejectWithValue(msg);
      }
    } catch (error) {
      roastError(error);
      return rejectWithValue(error.message);
    }
  }
);
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
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageLimit: (state, action) => {
      state.pageLimit = action.payload;
    },
    setSearchParam: (state, action) => {
      state.searchParam = action.payload;
    },
    setProductsOptions: (state, action) => {
      state.productsOptions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductList.pending, (state) => {
        state.productLoading = true;
      })
      .addCase(getAllProductList.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProductList = action.payload;
      })
      .addCase(getAllProductList.rejected, (state, action) => {
        state.productLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      });
  },
});

export const {
  setProductLoading,
  setAllProductList,
  setProductDialog,
  setProductData,
  setDeleteProductDialog,
  setProductImageState,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
  setProductsOptions
} = productItemSlice.actions;

export default productItemSlice.reducer;
