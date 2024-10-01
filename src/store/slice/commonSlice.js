import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerTypeOptions, employeeRoleOptions, errorMsg, roastError, successMsg } from "@/helper/commonValues";
import { setAllProductList, setSelectedProductData } from "./productItemSlice";
import { setAllPurchaseListData } from "./purchaseSlice";
import { setAllManufacturerList, setSelectedManufacturerData } from "./manufacturerSlice";
import { setAllEmployeeList, setSelectedEmployeeData } from "./employeeSlice";
import { setAllCustomerList, setSelectedCustomerData } from "./customerSlice";
import { setAllSalesListData, setSelectedSalesItemData } from "./salesSlice";

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
      if (err === 0) {

        if (payload?.modal_to_pass === "Products") {
          dispatch(setAllProductList(newObj))
        } else if (payload?.modal_to_pass === "Employees") {

          const updatedData = newObj?.list?.map((item) => {
            const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
            return {
              ...item,
              role: findRole?.label
            }
          })
          const updatedObject = { ...newObj, list: updatedData }
          dispatch(setAllEmployeeList(updatedObject));
        } else if (payload?.modal_to_pass === "Manufacturers") {
          dispatch(setAllManufacturerList(newObj));
        } else if (payload?.modal_to_pass === "Purchase") {
          dispatch(setAllPurchaseListData(newObj));
        } else if (payload?.modal_to_pass === "Sales") {
          dispatch(setAllSalesListData(newObj));
        } else if (payload?.modal_to_pass === "Customers") {
          const updatedData = newObj?.list?.map((item) => {
            const findType = customerTypeOptions?.find((type) => type.value === item.type)
            return {
              ...item,
              type: findType?.label
            }
          })
          const updatedObject = { ...newObj, list: updatedData }
          dispatch(setAllCustomerList(updatedObject));

        } else {
          console.error("Modal issue");
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
        } else if (payload?.modal_to_pass === "customer") {
          dispatch(setSelectedCustomerData(data));
        } else if (payload?.modal_to_pass === "sales") {
          dispatch(setSelectedSalesItemData(data));
        } 
        else {
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
          const updatedData = data?.list?.map((item) => {
            const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
            return {
              ...item,
              role: findRole?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllEmployeeList(updatedObject));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else if (payload?.modal_to_pass === "customer") {
          const updatedData = data?.list?.map((item) => {
            const findType = customerTypeOptions?.find((type) => type.value === item.type)
            return {
              ...item,
              type: findType?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllCustomerList(updatedObject));
        }
        else {
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
          const updatedData = data?.list?.map((item) => {
            const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
            return {
              ...item,
              role: findRole?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllEmployeeList(updatedObject));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else if (payload?.modal_to_pass === "customer") {
          const updatedData = data?.list?.map((item) => {
            const findType = customerTypeOptions?.find((type) => type.value === item.type)
            return {
              ...item,
              type: findType?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllCustomerList(updatedObject));
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
          const updatedData = data?.list?.map((item) => {
            const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
            return {
              ...item,
              role: findRole?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllEmployeeList(updatedObject));
        } else if (payload?.modal_to_pass === "manufacturer") {
          dispatch(setAllManufacturerList(data));
        } else if (payload?.modal_to_pass === "purchase") {
          dispatch(setAllPurchaseListData(data));
        } else if (payload?.modal_to_pass === "sales") {
          dispatch(setAllSalesListData(data));
        } else if (payload?.modal_to_pass === "customer") {
          const updatedData = data?.list?.map((item) => {
            const findType = customerTypeOptions?.find((type) => type.value === item.type)
            return {
              ...item,
              type: findType?.label
            }
          })
          const updatedObject = { ...data, list: updatedData }
          dispatch(setAllCustomerList(updatedObject));
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
