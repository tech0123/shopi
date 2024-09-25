import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  purchaseLoading: false,
  purchaseTableData: [],
  allPurchaseListData: [],
  deletePurchaseDialog: false
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
    },
    setAllPurchaseListData: (state, action) => {
      state.allPurchaseListData = action.payload;
    },
    setDeletePurchaseDialog: (state, action) => {
      state.deletePurchaseDialog = action.payload;
    }
  }
});

export const {
  setPurchaseLoading,
  setPurchaseTableData,
  setAllPurchaseListData,
  setDeletePurchaseDialog
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
