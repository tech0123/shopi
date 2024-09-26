import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { errorMsg, roastError, successMsg } from "@/helper/commonValues";
import { setAllProductList, setSelectedProductData } from "./productItemSlice";
import { setAllPurchaseListData } from "./purchaseSlice";
import { setAllManufacturerList, setSelectedManufacturerData } from "./manufacturerSlice";
import { setAllEmployeeList, setSelectedEmployeeData } from "./employeeSlice";

let initialState = {
  commonLoading: false,
  currentPage: 1,
  pageLimit: 7,
  searchParam: '',
};

export const getAllDataList = createAsyncThunk(
  '/api/crud/get',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/crud/get`, payload);
      const { data, msg, err } = response.data;
      const newObj = {
        list: data?.list ? data?.list : [],
        pageNo: data?.pageNo ? data?.pageNo : '',
        totalRows: data?.totalRows ? data?.totalRows : 0,
      };
      console.log('payload?.modal_to_pass', payload?.modal_to_pass)
      if (err === 0) {

        if (payload?.modal_to_pass === "Products") {
          dispatch(setAllProductList(newObj))
        } else if (payload?.modal_to_pass === "Employees") {
          dispatch(setAllEmployeeList(newObj));
        } else if (payload?.modal_to_pass === "Manufacturers") {
          dispatch(setAllManufacturerList(newObj));
        } else if (payload?.modal_to_pass === "Purchase") {
          dispatch(setAllPurchaseListData(newObj));
        }
        return newObj;
      } else if (err === 1) {
        errorMsg(msg);
        return false;
      } else {
        return false;
      }
    } catch (e) {
      roastError(e);
      return false;
    }
  }
);

export const getSingleItem = createAsyncThunk(
  '/api/crud/getSingle',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/crud/getSingle`, payload);
      const { data, msg, err } = response.data;
      if (err === 0) {
        if (payload?.modal_to_pass === "product") {
          dispatch(setSelectedProductData(data))
        } else if (payload?.modal_to_pass === "employee") {
          dispatch(setSelectedEmployeeData(data));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setSelectedManufacturerData(data));
        } else {
          console.error("Modal issue");
        }
        return data;
      } else if (err === 1) {
        errorMsg(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  }
);

export const addItem = createAsyncThunk(
  '/api/crud/add',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/crud/add`, payload);
      const { data, msg, err } = response.data;

      if (err === 0) {
        if (payload?.modal_to_pass === "product") {
          dispatch(setAllProductList(data))
        } else if (payload?.modal_to_pass === "employee") {
          dispatch(setAllEmployeeList(data));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else {
          console.error("Modal issue");
        }
        successMsg(msg);
        return data;
      } else if (err === 1) {
        errorMsg(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  }
);

export const updateItem = createAsyncThunk(
  '/api/crud/update',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/crud/update`, payload);
      const { data, msg, err } = response.data;
      if (err === 0) {
        if (payload?.modal_to_pass === "product") {
          dispatch(setAllProductList(data))
        } else if (payload?.modal_to_pass === "employee") {
          dispatch(setAllEmployeeList(data));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else {
          console.error("Modal issue");
        }
        successMsg(msg);
        return data;
      } else if (err === 1) {
        errorMsg(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  }
);

export const deleteItem = createAsyncThunk(
  '/api/crud/delete',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setCommonLoading(true));
      const response = await axios.post(`/api/crud/delete`, payload);
      const { data, msg, err } = response.data;

      if (err === 0) {

        if (payload?.modal_to_pass === "product") {
          dispatch(setAllProductList(data))
        } else if (payload?.modal_to_pass === "employee") {
          dispatch(setAllEmployeeList(data));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else {
          console.error("Modal issue");
        }
        successMsg(msg);
        return data;
      } else if (err === 1) {
        errorMsg(msg);
        return false;
      } else return false;
    } catch (e) {
      roastError(e);
      return false;
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCommonLoading: (state, action) => {
      state.commonLoading = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDataList.pending, (state) => {
        state.commonLoading = true;
      })
      .addCase(getAllDataList.fulfilled, (state, action) => {
        state.commonLoading = false;
      })
      .addCase(getAllDataList.rejected, (state, action) => {
        state.commonLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      })

      .addCase(getSingleItem.pending, (state) => {
        state.commonLoading = true;
      })
      .addCase(getSingleItem.fulfilled, (state, action) => {
        state.commonLoading = false;

      })
      .addCase(getSingleItem.rejected, (state, action) => {
        state.commonLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      })

      .addCase(addItem.pending, (state) => {
        state.commonLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.commonLoading = false;

      })
      .addCase(addItem.rejected, (state, action) => {
        state.commonLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      })

      .addCase(updateItem.pending, (state) => {
        state.commonLoading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.commonLoading = false;

      })
      .addCase(updateItem.rejected, (state, action) => {
        state.commonLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      })

      .addCase(deleteItem.pending, (state) => {
        state.commonLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.commonLoading = false;

      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.commonLoading = false;
        console.error("Error: ", action.payload || action.error.message);
      });
  },
});

export const {
  setCommonLoading,
  setCurrentPage,
  setPageLimit,
  setSearchParam
} = commonSlice.actions;

export default commonSlice.reducer;
