'use client';
import React, { useEffect } from "react";
import CustomerReport from "./CustomerReport";
import { useDispatch, useSelector } from "react-redux";
import SalesAndPurchaseReport from "./SalesAndPurchaseReport";
import { getSalesReportData } from "@/store/slice/reportSlice";

const Report = () => {
  const dispatch = useDispatch() 

  const { reportsData } = useSelector(({ report }) => report)
  
  useEffect(() => {
    dispatch(getSalesReportData())
  },[])

  return (
    <>
      <div className="form_container d-flex justify-around">
        <div>
          <h6>{`₹ ${reportsData?.purchase_report_data?.total_count || 0}`}</h6>
          <h5 style={{ color: "#c5a838"}}>Total Purchase Count</h5>
        </div>
        <div>
          <h6>{`₹ ${reportsData?.sales_report_data?.total_count || 0}`}</h6>
          <h5 style={{ color: "#c5a838"}}>Total Sale</h5>
        </div>
      </div>
      <div>
        <SalesAndPurchaseReport/>
      </div>
      <div>
        <CustomerReport/>
      </div>
    </>
  );
};

export default Report;
