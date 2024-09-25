import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { errorMsg, roastError, successMsg } from "@/helper/commonValues";
import { setAllProductList } from "./productItemSlice";
import { setAllProductsData } from "./cartSlice";

let initialState = {
  commonLoading: false,
  // currentPage: 1,
  // pageLimit: 10,
  // searchParam: '',
};

export const getAllDataList = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/get`, payload);
    const { data, msg, err } = response.data;


    // if (err === 0) {
    //   return data;
    // } else if (err === 1) {
    //   errorMsg(msg);
    //   return false;
    // } else return false;
    const newObj = {
      list: data?.list ? data?.list : [],
      pageNo: data?.pageNo ? data?.pageNo : '',
      totalRows: data?.totalRows ? data?.totalRows : 0,
    };
    if (err === 0) {
      if (payload.modal_to_pass === "Products") {
        dispatch(setAllProductList(newObj))

      }
      else if (payload.modal_to_pass === "Cart") {
        // dispatch(setAllProductsData(data.list))

      }
      return (data);
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else {
      return false;
    }
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCommonLoading(false));
  }
};

export const getSingleItem = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/getSingle`, payload);
    const { data, msg, err } = response.data;

    if (err === 0) {
      return data;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCommonLoading(false));
  }
};

export const addItem = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/add`, payload);
    const { data, msg, err } = response.data;

    if (err === 0) {
      successMsg(msg);

      if (payload.modal_to_pass === "product") {
        dispatch(setAllProductList(data))
      }
      else if (payload.modal_to_pass === "customer") {
      } else if (payload.modal_to_pass === "employee") {
      } else if (payload.modal_to_pass === "manufacturer") {
      } else {

      }

      return data;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCommonLoading(false));
  }
};

export const updateItem = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/update`, payload);
    const { data, msg, err } = response.data;
    if (err === 0) {
      successMsg(msg);

      if (payload.modal_to_pass === "product") {
        dispatch(setAllProductList(data))
      }
      //  else if (payload.modal_to_pass === "customer") {
      // } else if (payload.modal_to_pass === "employee") {
      // } else if (payload.modal_to_pass === "manufacturer") {
      // } else {

      // }

      return data;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCommonLoading(false));
  }
};

export const deleteItem = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/delete`, payload);
    const { data, msg, err } = response.data;
    const newObj = {
      list: data?.list ? data?.list : [],
      pageNo: data?.pageNo ? data?.pageNo : '',
      totalRows: data?.totalRows ? data?.totalRows : 0,
    };
    console.log('data', data)
    if (err === 0) {
      successMsg(msg);

      // if (payload.modal_to_pass === "product") {
      // dispatch(setAllProductList(newObj))
      // }
      //  else if (payload.modal_to_pass === "customer") {
      // } else if (payload.modal_to_pass === "employee") {
      // } else if (payload.modal_to_pass === "manufacturer") {
      // } else {

      // }

      return newObj;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setCommonLoading(false));
  }
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCommonLoading: (state, action) => {
      state.commonLoading = action.payload;
    },
    // setCurrentPage: (state, action) => {
    //   state.currentPage = action.payload;
    // },
    // setPageLimit: (state, action) => {
    //   state.pageLimit = action.payload;
    // },
    // setSearchParam: (state, action) => {
    //   state.searchParam = action.payload;
    // },
  }
});

export const { setCommonLoading,
  // setCurrentPage, setPageLimit, setSearchParam 
} = commonSlice.actions;

export default commonSlice.reducer;
