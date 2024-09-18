import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  purchaseLoading: false,
  purchaseTableData: []
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setPurchaseLoading: (state, action) => {
      state.purchaseLoading = action.payload;
    },
    setPurchaseTableData: (state, action) => {
      state.purchaseTableData = action.payload;
    }
  }
});

export const {
  setPurchaseLoading,
  setPurchaseTableData
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
