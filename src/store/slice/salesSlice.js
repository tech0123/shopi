import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  salesTableData: [],
  allSalesListData: [],
  deleteSalesDialog: false,
  selectedSalesItemData: {},
  salesItemSearchParam: ""
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSalesTableData: (state, action) => {
      state.salesTableData = action.payload;
    },
    setAllSalesListData: (state, action) => {
      state.allSalesListData = action.payload;
    },
    setDeleteSalesDialog: (state, action) => {
      state.deleteSalesDialog = action.payload;
    },
    setSelectedSalesItemData: (state, action) => {
      state.selectedSalesItemData = action.payload;
    },
    setSalesItemSearchParam: (state, action) => {
      state.salesItemSearchParam = action.payload;
    }
  }
});

export const {
  setSalesTableData,
  setAllSalesListData,
  setDeleteSalesDialog,
  setSelectedSalesItemData,
  setSalesItemSearchParam
} = salesSlice.actions;

export default salesSlice.reducer;
