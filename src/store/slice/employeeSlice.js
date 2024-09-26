import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { errorMsg, roastError, successMsg } from "@/helper/commonValues";

const employeeInitialData = {
  image: '',
  name: "",
  email: "",
  mobile_number: "",
  role: "",
  password: "",
  salary: 0
};

let initialState = {
  allEmployeeList: [],
  employeeDialog: false,
  selectedEmployeeData: employeeInitialData,
  deleteEmployeeDialog: false
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
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
  setAllEmployeeList,
  setSelectedEmployeeData,
  setEmployeeDialog,
  setDeleteEmployeeDialog
} = employeeSlice.actions;

export default employeeSlice.reducer;
