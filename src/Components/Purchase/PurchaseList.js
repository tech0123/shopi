"use client";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import _ from "lodash";
import Loader from "@/helper/CommonComponent/Loader";
import {
  deleteItem,
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import {
  setDeletePurchaseDialog,
  setPurchaseTableData,
} from "@/store/slice/purchaseSlice";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { purchase_search_key } from "@/helper/commonValues";
import { Tooltip } from "primereact/tooltip";
import { Button } from "react-bootstrap";

const tableColumns = [
  { field: "manufacturer_name", header: "Manufacturer Name" },
  { field: "purchase_date", header: "Purchase Date" },
  { field: "bill_no", header: "Bill No" },
  { field: "gst_no", header: "GST No." },
  { field: "mobile_number", header: "Mobile Number" },
  { field: "address", header: "Address" },
];

function PurchaseList() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedPurchaseData, setSelectedPurchaseData] = useState({});
  const { allPurchaseListData, deletePurchaseDialog } = useSelector(
    ({ purchase }) => purchase
  );
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );

  const fetchPurchaseList = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Purchase",
        search_key: purchase_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchPurchaseList(currentPage, pageLimit, searchParam);
  }, []);

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchPurchaseList(pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page) => {
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0
        ? allPurchaseListData?.totalRows
          ? allPurchaseListData?.totalRows
          : 0
        : page;
    const prevPageValue =
      pageLimit === 0
        ? allPurchaseListData?.totalRows
          ? allPurchaseListData?.totalRows
          : 0
        : pageLimit;
    if (
      prevPageValue < allPurchaseListData?.totalRows ||
      pageValue < allPurchaseListData?.totalRows
    ) {
      fetchPurchaseList(page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchPurchaseList(currentPage, pageLimit, e.target.value?.trim());
  };

  const handleChangeSearch = (e) => {
    debounceHandleSearchInput(e);
    dispatch(setSearchParam(e.target.value));
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce((e) => {
      handleSearchInput(e);
    }, 800),
    []
  );

  const handleAddItem = () => {
    dispatch(setPurchaseTableData([]));
    router.push("/purchase/add");
  };

  const handleEditItem = async (id) => {
    router.push(`/purchase/${id}`);
  };

  const handleDeleteItem = (item) => {
    dispatch(setDeletePurchaseDialog(true));
    setSelectedPurchaseData(item);
  };

  const hidePurchaseDeleteDialog = () => {
    dispatch(setDeletePurchaseDialog(false));
  };

  const handleDeletePurchaseItem = async () => {
    const payload = {
      modal_to_pass: "purchase",
      id: selectedPurchaseData?._id,
      search_key: purchase_search_key,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };
    const res = await dispatch(deleteItem(payload));
    if (res?.payload) {
      dispatch(setDeletePurchaseDialog(false));
    }
  };

  const actionBodyResponsiveTemplate = (rowData) => {
    return (
      // <>
      //   <p
      //     className="text-left text-sm m-0"
      //     onClick={() => handleEditItem(rowData?._id)}
      //   >
      //     Edit
      //   </p>
      //   <p
      //     className="text-left text-sm m-0"
      //     onClick={() => handleDeleteItem(rowData)}
      //   >
      //     Delete
      //   </p>
      // </>

      <div className="responsivecard-btn-group">
        <button
          className="edit_btn gradient_common_btn"
          onClick={() => handleEditItem(rowData?._id)}
        >
          Edit
        </button>
        <button
          className="delete_btn gradient_common_btn"
          onClick={() => handleDeleteItem(rowData)}
        >
          Delete
        </button>
      </div>
    );
  };

  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="purchase-list_card w-100">
        <div className="container flex flex-md-row flex-column responsive-table-product-card">
          <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
            <div className="flex-1 lg:col-3 responsive-card-details-first">
              <p className="responsive-card-content">
                <span>Code:</span> {rowData?.code}
              </p>
              <p className="responsive-card-content">
                <span>Full Name:</span> {rowData?.manufacturer_name}
              </p>
              <p className="responsive-card-content">
                <span>Phone Number:</span> {rowData?.mobile_number}
              </p>
            </div>
            <div className="flex-1 lg:col-3 responsive-card-details-1">
              <p className="responsive-card-content">
                <span>GST No.:</span> {rowData?.gst_no}
              </p>
              {/* <p className="responsive-card-content">
              <span>Address:</span> {rowData.address}
            </p> */}
              <Tooltip target=".tooltipClass" />
              <span
                className="tooltipClass"
                data-pr-tooltip={rowData.description}
                data-pr-position="top"
              >
                <p className="product-description responsive-content-width text-truncate responsive-card-content">
                  <span>Address:</span> {rowData.address}
                </p>
              </span>
            </div>
            <div className="flex-1 lg:col-3 responsive-card-details-2">
              <div className="text-left">
                {actionBodyResponsiveTemplate(rowData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {commonLoading && <Loader />}
      <CommonDataTable
        tableName="Purchase List"
        tableColumns={tableColumns}
        allItemList={allPurchaseListData}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deletePurchaseDialog}
        hideDeleteDialog={hidePurchaseDeleteDialog}
        deleteItem={handleDeletePurchaseItem}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
      />
    </>
  );
}

export default PurchaseList;
