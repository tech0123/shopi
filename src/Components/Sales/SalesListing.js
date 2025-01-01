"use client";
import React, { memo, useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import {
  deleteItem,
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import {
  setDeleteSalesDialog,
  setSalesTableData,
} from "@/store/slice/salesSlice";
import { sales_search_key } from "@/helper/commonValues";
import Loader from "@/helper/CommonComponent/Loader";

const tableColumns = [
  { field: "customer_name", header: "Customer Name" },
  { field: "sales_date", header: "Purchase Date" },
  { field: "bill_no", header: "Bill No" },
  { field: "mobile_number", header: "Mobile Number" },
  { field: "address", header: "Address" },
];

const SalesListing = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedSalesData, setSelectedSalesData] = useState({});
  const { allSalesListData, deleteSalesDialog } = useSelector(
    ({ sales }) => sales
  );
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );

  const fetchSalesList = useCallback(
    async (key_name, start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: key_name,
        start: start,
        limit: limit,
        search: search?.trim(),
        search_key: sales_search_key,
      };
      dispatch(getAllDataList(payload));
    },
    [dispatch]
  );
  useEffect(() => {
    fetchSalesList("Sales", currentPage, pageLimit, searchParam);
    return () => {
      dispatch(setSearchParam(""));
    };
  }, []);

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchSalesList("Sales", pageIndex, pageLimit, searchParam);
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
      fetchSalesList("Sales", page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchSalesList("Sales", currentPage, pageLimit, e.target.value?.trim());
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
    dispatch(setSalesTableData([]));
    router.push("/sales/add");
  };

  const handleEditItem = async (id) => {
    router.push(`/sales/${id}`);
  };

  const handleDeleteItem = (item) => {
    dispatch(setDeleteSalesDialog(true));
    setSelectedSalesData(item);
  };

  const hideSalesDeleteDialog = () => {
    dispatch(setDeleteSalesDialog(false));
  };

  const handleDeleteSalesItem = async () => {
    const payload = {
      modal_to_pass: "sales",
      id: selectedSalesData?._id,
      search_key: sales_search_key,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };
    const res = await dispatch(deleteItem(payload));
    if (res?.payload) {
      dispatch(setDeleteSalesDialog(false));
    }
  };

  const actionBodyResponsiveTemplate = (rowData) => {
    return (
      <>
        <p
          className="text-left text-sm"
          onClick={() => handleEditItem(rowData?._id)}
        >
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

  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="container flex flex-col border-white border-2 w-full">
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex-1 border-r-2 border-white p-2">
            <p className="text-left text-sm">Code: {rowData?.code}</p>
            <p className="text-left text-sm">
              Full Name: {rowData?.manufacturer_name}
            </p>
            <p className="text-left text-sm">
              Phone Number: {rowData?.mobile_number}
            </p>
          </div>
          <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
            <p className="text-left text-sm">GST No.: {rowData?.gst_no}</p>
            <p className="text-left text-sm">Address: {rowData.address}</p>
          </div>
          <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
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
      {commonLoading && <Loader />}
      <CommonDataTable
        tableName="Sales List"
        tableColumns={tableColumns}
        allItemList={allSalesListData}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deleteSalesDialog}
        hideDeleteDialog={hideSalesDeleteDialog}
        deleteItem={handleDeleteSalesItem}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default memo(SalesListing);
