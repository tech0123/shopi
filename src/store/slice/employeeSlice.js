import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { errorMsg, roastError, successMsg } from "@/helper/commonValues";

const employeeInitialData = {
  name: "",
  email: "",
  mobile_number: "",
  role: "",
  salary: 0
};

let initialState = {
  employeeLoading: false,
  allEmployeeList: [],
  selectedEmployeeData: employeeInitialData,
  employeeDialog: false,
  deleteEmployeeDialog: false
};

export const getEmployeeList = payload => async dispatch => {
  try {
    dispatch(setEmployeeLoading(true));
    const response = await axios.get(`/api/Employee/getEmployees`);
    const { data, msg, err } = response.data;

    dispatch(setAllEmployeeList(data));
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
    dispatch(setEmployeeLoading(false));
  }
};

export const addEmployeeList = payload => async dispatch => {
  try {
    dispatch(setEmployeeLoading(true));
    const response = await axios.get(`/api/Employee/addEmployee`, payload);
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
    },
    setSelectedEmployeeData: (state, action) => {
      state.selectedEmployeeData = action.payload;
    },
    setEmployeeDialog: (state, action) => {
      state.employeeDialog = action.payload;
    },
    setDeleteEmployeeDialog: (state, action) => {
      state.deleteEmployeeDialog = action.payload;
    }
  }
});

export const {
  setEmployeeLoading,
  setAllEmployeeList,
  setSelectedEmployeeData,
  setEmployeeDialog,
  setDeleteEmployeeDialog
} = employeeSlice.actions;

export default employeeSlice.reducer;
