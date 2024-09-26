import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  purchaseTableData: [],
  allPurchaseListData: [],
  deletePurchaseDialog: false
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
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
  setPurchaseTableData,
  setAllPurchaseListData,
  setDeletePurchaseDialog
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
