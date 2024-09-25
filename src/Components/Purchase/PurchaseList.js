'use client';
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import Loader from "@/helper/CommonComponent/Loader";
import { deleteItem, getAllDataList, getSingleItem } from "@/store/slice/commonSlice";
import { setAllPurchaseListData, setDeletePurchaseDialog, setPurchaseTableData } from "@/store/slice/purchaseSlice";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const tableColumns = [
  {field: 'manufacturer_name', header:"Manufacturer Name"},
  {field: 'purchase_date', header:"Purchase Date"},
  {field: 'bill_no', header:"Bill No"},
  {field: 'gst_no', header:"GST No."},
  {field: 'mobile_number', header:"Mobile Number"},
  {field: 'address', header:"Address"},
]

function PurchaseList() {
  const dispatch = useDispatch();
  const router = useRouter()

  const [ selectedPurchaseData, setSelectedPurchaseData ] = useState({});
  const { allPurchaseListData, deletePurchaseDialog } = useSelector(({ purchase }) => purchase)
  const {commonLoading } = useSelector(({common}) => common)

  const fetchManufacturerList = useCallback(async () => {
    const payload = { modal_to_pass: "Purchase" }
    const res = await dispatch(getAllDataList(payload))
    if(res){
      dispatch(setAllPurchaseListData(res))
    }
  },[])
  
  useEffect(() => {
      fetchManufacturerList()
  }, []);

  const handleAddItem = () => {
    dispatch(setPurchaseTableData([]))
    router.push('/purchase/add')
  };

  const handleEditItem = async (id) => {
    router.push(`/purchase/${id}`)
  };

  const handleDeleteItem = item => {
    dispatch(setDeletePurchaseDialog(true));
    setSelectedPurchaseData(item)
  };

  const hidePurchaseDeleteDialog = () => {
    dispatch(setDeletePurchaseDialog(false));
  };

  const handleDeletePurchaseItem = async () => {
    const payload = { modal_to_pass: 'purchase', id: selectedPurchaseData?._id };
    const res = await dispatch(deleteItem(payload))
    if(res){
      dispatch(setAllPurchaseListData(res))
      dispatch(setDeletePurchaseDialog(false));
    }
  };

  const actionBodyResponsiveTemplate = rowData => {
    return (
      <>
        <p className="text-left text-sm" onClick={() => handleEditItem(rowData?._id)}>
          Edit
        </p>
        <p
          className="text-left text-sm"
          onClick={() => handleDeleteItem(rowData)}
        >
          Delete
        </p>
      </>
    );
};

  const responsiveTableTemplete = rowData => {
    return (
      <div className="container flex flex-col border-white border-2 w-full">
        <div className="flex justify-center border-b-2 border-white p-2">
            <img
                src={`${rowData.image}`}
                alt=""
                width={150}
                height={150}
            />
        </div>
        <div className="flex flex-1 flex-col md:flex-row">
            <div className="flex-1 border-r-2 border-white p-2">
                <p className="text-left text-sm">
                    Code: {rowData.code}
                </p>
                <p className="text-left text-sm">
                    Full Name: {rowData.name}
                </p>
                <p className="text-left text-sm">
                    Email Address: {rowData.email_address}
                </p>
                <p className="text-left text-sm">
                    Phone Number: {rowData.mobile_number}
                </p>
            </div>
            <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
                <p className="text-left text-sm">
                    GST No.: {rowData.GST_no}
                </p>
                <p className="text-left text-sm">
                    Country: {rowData.country}
                </p>
                <p className="text-left text-sm">
                    State: {rowData.state}
                </p>
                <p className="text-left text-sm">
                    City: {rowData.pin_codeity}
                </p>
            </div>
            <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
                <p className="text-left text-sm">
                    Pin code: {rowData.pin_code}
                </p>
                <p className="text-left text-sm">
                    Address: {rowData.address}
                </p>
                <div className="text-left mt-1">
                    {actionBodyResponsiveTemplate(rowData)}
                </div>
            </div>
        </div>
      </div>
    );
};

  return (
    <>
      {commonLoading && <Loader/>}
      <CommonDataTable
        tableName="Purchase List"
        tableColumns={tableColumns}
        allItemList={allPurchaseListData}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deletePurchaseDialog}
        hideDeleteDialog={hidePurchaseDeleteDialog}
        deleteItem={handleDeletePurchaseItem}
      />
    </>
  )
}

export default PurchaseList;
