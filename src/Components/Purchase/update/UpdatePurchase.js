"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { getSingleItem } from "@/store/slice/commonSlice";
import CommonAddEditPurchase from "../CommonAddEditPurchase";
import { setPurchaseTableData } from "@/store/slice/purchaseSlice";
import { generateUniqueId } from "@/helper/commonValues";

const initialPurchaseValue = {
  manufacturer_name: "",
  manufacturer: "",
  purchase_date: "",
  bill_no: "",
  gst_no: "",
  mobile_number: "",
  address: "",
  purchase_record_table: [],
  sub_total: 0,
  discount: 0,
  tax: 0,
  total_amount: 0,
};

const UpdatePurchase = () => {
  const dispatch = useDispatch();
  const { purchaseId } = useParams();
  const [initialState, setInitialState] = useState(initialPurchaseValue);

  const fetchPurchaseData = useCallback(async () => {
    const payload = { modal_to_pass: "purchase", id: purchaseId };
    const response = await dispatch(getSingleItem(payload));
    const res = response?.payload;
    if (res) {
      let updatedPurchaseTableData = [];

      if (res?.purchase_record_table?.length) {
        updatedPurchaseTableData = res?.purchase_record_table?.map((item) => {
          return {
            ...item,
            unique_id: generateUniqueId(),
          };
        });
      }

      const getItemData = {
        ...res,
        manufacturer_name: res?.manufacturer_name,
        manufacturer: res?.manufacturer,
        purchase_date: res?.purchase_date,
        bill_no: res?.bill_no,
        gst_no: res?.gst_no,
        mobile_number: res?.mobile_number,
        address: res?.address,
        purchase_record_table: updatedPurchaseTableData,
        tax: res?.tax,
        discount: res?.discount,
        sub_total: "",
        total_amount: "",
      };

      setInitialState(getItemData);
      dispatch(setPurchaseTableData(updatedPurchaseTableData));
    }
  }, [purchaseId]);

  useEffect(() => {
    fetchPurchaseData();
  }, [purchaseId]);

  return (
    // <div>
    <>
      <div className="container-fluid m-0 p-0 overflow-hidden main_modal_area">
        <div className="p-2 modal__gap">
          <CommonAddEditPurchase initialValue={initialState} />
        </div>
      </div>
    </>
  );
};

export default memo(UpdatePurchase);
