import axios from "axios";
import { toast } from "react-toastify";
import { createSlice } from "@reduxjs/toolkit";
import { roastError } from "@/helper/commonValues";

let initialState = {
  commonLoading: false
};

export const getAllDataList = payload => async dispatch => {
  try {
    dispatch(setCommonLoading(true));
    const response = await axios.post(`/api/crud/get`, payload);
    const { data, msg, err } = response.data;

    if (err === 0) {
      return data;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
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
      toast.error(msg);
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
      toast.success(msg);
      return data;
    } else if (err === 1) {
      toast.error(msg);
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
      toast.success(msg);
      return data;
    } else if (err === 1) {
      toast.error(msg);
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

    if (err === 0) {
      toast.success(msg);
      return data;
    } else if (err === 1) {
      toast.error(msg);
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
    }
  }
});

export const { setCommonLoading } = commonSlice.actions;

export default commonSlice.reducer;
