import { createSlice } from "@reduxjs/toolkit";

const manufacturerInitialData = {
  code: "",
  name: "",
  email_address: "",
  mobile_number: "",
  gst_no: "",
  country: "",
  state: "",
  city: "",
  pin_code: "",
  address: ""
};

let initialState = {
  allManufacturerList: [],
  manufacturerDialog: false,
  selectedManufacturerData: manufacturerInitialData,
  deleteManufacturerDialog: false,
  manufacturerOptions: []
};

const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState,
  reducers: {
    setAllManufacturerList: (state, action) => {
      state.allManufacturerList = action.payload;
    },
    setManufacturerDialog: (state, action) => {
      state.manufacturerDialog = action.payload;
    },
    setSelectedManufacturerData: (state, action) => {
      state.selectedManufacturerData = action.payload;
    },
    setDeleteManufacturerDialog: (state, action) => {
      state.deleteManufacturerDialog = action.payload;
    },
    setManufacturerOptions: (state, action) => {
      state.manufacturerOptions = action.payload;
    }
  }
});

export const {
  setAllManufacturerList,
  setSelectedManufacturerData,
  setManufacturerDialog,
  setDeleteManufacturerDialog,
  setManufacturerOptions
} = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
