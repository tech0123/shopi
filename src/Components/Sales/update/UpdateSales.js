"use client";
import React, { useCallback, useEffect, useState } from "react";
import CommonAddEditSales from "../CommonAddEditSales";
import { setSalesTableData } from "@/store/slice/salesSlice";
import { generateUniqueId } from "@/helper/commonValues";
import { getSingleItem } from "@/store/slice/commonSlice";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

const initialSalesValue = {
  customer_name: "",
  customer: "",
  sales_date: "",
  bill_no: "",
  mobile_number: "",
  address: "",
  sales_record_table: [],
  sub_total: 0,
  discount: 0,
  tax: 0,
  total_amount: 0,
};

const UpdateSales = () => {
  const dispatch = useDispatch();
  const { salesId } = useParams();
  const [initialState, setInitialState] = useState(initialSalesValue);

  const fetchPurchaseData = useCallback(
    // 7v4vRk71Sv8tmHFk
    async () => {
      const payload = { modal_to_pass: "sales", id: salesId };
      const response = await dispatch(getSingleItem(payload));
      const res = response?.payload;
      if (res) {
        let updatedSalesTableData = [];

        if (res?.sales_record_table?.length) {
          updatedSalesTableData = res?.sales_record_table?.map((item) => {
            return {
              ...item,
              unique_id: generateUniqueId(),
            };
          });
        }

        const getItemData = {
          ...res,
          customer_name: res?.customer_name,
          customer: res?.customer,
          sales_date: res?.sales_date,
          bill_no: res?.bill_no,
          mobile_number: res?.mobile_number,
          address: res?.address,
          sales_record_table: updatedSalesTableData,
          tax: res?.tax,
          discount: res?.discount,
          sub_total: "",
          total_amount: "",
        };

        setInitialState(getItemData);
        dispatch(setSalesTableData(updatedSalesTableData));
      }
    },
    [salesId]
  );

  useEffect(() => {
    fetchPurchaseData();
  }, [salesId]);

  return (
    <>
      <div className="container-fluid m-0 p-0 overflow-hidden main_modal_area">
        <div className="p-2 sales_purchase_main_gap">
          <CommonAddEditSales initialValue={initialState} />
        </div>
      </div>
    </>
  );
};

export default UpdateSales;
