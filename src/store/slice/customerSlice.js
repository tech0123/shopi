import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { errorMsg, roastError, successMsg } from "@/helper/commonValues";

const customerInitialData = {
    image: '',
    name: "",
    email: "",
    mobile_number: "",
    type: "",
};

let initialState = {
    allCustomerList: [],
    customerDialog: false,
    selectedCustomerData: customerInitialData,
    deleteCustomerDialog: false
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setAllCustomerList: (state, action) => {
            state.allCustomerList = action.payload;
        },
        setSelectedCustomerData: (state, action) => {
            state.selectedCustomerData = action.payload;
        },
        setCustomerDialog: (state, action) => {
            state.customerDialog = action.payload;
        },
        setDeleteCustomerDialog: (state, action) => {
            state.deleteCustomerDialog = action.payload;
        }
    }
});

export const {
    setAllCustomerList,
    setSelectedCustomerData,
    setCustomerDialog,
    setDeleteCustomerDialog
} = customerSlice.actions;

export default customerSlice.reducer;
