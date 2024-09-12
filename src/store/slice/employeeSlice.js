import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

let initialState = {
  employeeLoading: false,
  allEmployeeList: []
};

export const getEmployeeList = payload => async dispatch => {
  try {
    dispatch(setEmployeeLoading(true));
    const response = await axios.get(`/api/Employee/getEmployees`);
    const { data, msg, err } = response.data;

    dispatch(setAllEmployeeList(data));
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
    dispatch(setEmployeeLoading(false));
  }
};

export const addEmployeeList = payload => async dispatch => {
  try {
    dispatch(setEmployeeLoading(true));
    const response = await axios.get(`/api/Employee/addEmployee`, payload);
    const { data, msg, err } = response.data;

    console.log("data", data);

    if (err === 0) {
      toast.success(msg);
      return true;
    } else if (err === 1) {
      toast.error(msg);
      return false;
    } else return false;
  } catch (e) {
    roastError(e);
    return false;
  } finally {
    dispatch(setEmployeeLoading(false));
  }
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployeeLoading: (state, action) => {
      state.employeeLoading = action.payload;
    },
    setAllEmployeeList: (state, action) => {
      state.allEmployeeList = action.payload;
    }
  }
  //   extraReducers: {
  //     [getEmployeeList.pending]: state => {
  //       state.employeeLoading = true;
  //     },
  //     [getEmployeeList.rejected]: state => {
  //       state.allEmployeeList = [];
  //       state.employeeLoading = false;
  //     },
  //     [getEmployeeList.fulfilled]: (state, action) => {
  //       state.allEmployeeList = action.payload;
  //       state.employeeLoading = false;
  //     }
  //   }
});

export const { setEmployeeLoading, setAllEmployeeList } = employeeSlice.actions;

export default employeeSlice.reducer;
