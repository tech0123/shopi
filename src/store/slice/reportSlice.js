import { errorMsg } from "@/helper/commonValues";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let initialState = {
  reportsData: {},
  reportLoading: false,
  customerReportData: [],
  customerReportLoading: false,
};

export const getSalesReportData = payload => async dispatch => {
  try {
    dispatch(setReportLoading(true));

    const res = await axios.post(`api/reports/salesReport`, payload);
    const { msg, err } = res.data;

    const updatedData = {
        purchase_report_data: res?.data?.purchase_report_data,
        sales_report_data: res?.data?.sales_report_data
    }

    if (err === 0) {
      dispatch(setReportsData(updatedData));
      return updatedData;
    } else if (err === 1) {
      errorMsg(msg);
      return false;
    }
  } catch (error) {
    dispatch(setReportLoading(false));
  } finally {
    dispatch(setReportLoading(false));
  }
};


export const getCustomerReportData = (payload) => async (dispatch) => {
  try {
    dispatch(setCustomerReportLoading(true))

    const res = await axios.post(`api/reports/customerReport`, payload)
    const {list, msg, err} = res.data

    if(err === 0) {
      dispatch(setCustomerReportData(list));
      return list
    } else if (err === 1){
      errorMsg(msg)
      return false
    }

  } catch (error) {
    console.error("Fetch the data of customer report",error)
    dispatch(setCustomerReportLoading(false))
  } finally {
    dispatch(setCustomerReportLoading(false))
  }
}

const reportSliceSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportLoading: (state, action) => {
      state.reportLoading = action.payload;
    },
    setCustomerReportLoading: (state, action) => {
      state.customerReportLoading = action.payload;
    },
    setReportsData: (state, action) => {
      state.reportsData = action.payload;
    },
    setCustomerReportData: (state, action) => {
      state.customerReportData = action.payload;
    }
  }
});

export const { setReportLoading, setReportsData, setCustomerReportLoading, setCustomerReportData } = reportSliceSlice.actions;

export default reportSliceSlice.reducer;
