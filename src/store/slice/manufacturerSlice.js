import { createSlice } from "@reduxjs/toolkit";

const manufacturerInitialData = {
  code: "",
  name: "",
  email_address: "",
  mobile_number: "",
  GST_no: "",
  country: "",
  state: "",
  city: "",
  pin_code: "",
  address: ""
};

let initialState = {
  manufacturerLoading: false,
  allManufacturerList: [],
  selectedManufacturerData: manufacturerInitialData,
  manufacturerDialog: false,
  deleteManufacturerDialog: false,
  manufacturerOptions: []
};

const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState,
  reducers: {
    setManufacturerLoading: (state, action) => {
      state.manufacturerLoading = action.payload;
    },
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
  setManufacturerLoading,
  setAllManufacturerList,
  setSelectedManufacturerData,
  setManufacturerDialog,
  setDeleteManufacturerDialog,
  setManufacturerOptions
} = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
