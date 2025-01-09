"use client";
import _ from "lodash";
import Image from "next/image";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import React, { useState, useEffect, useCallback } from "react";
import CustomPaginator from "@/helper/CommonComponent/CustomPaginator";
import {
  setCalcValues,
  setSelectedProducts,
  setSubTotal,
  setSearchCustomer,
  setSelectedCustomer,
} from "@/store/slice/cartSlice";
import { setAllProductList } from "@/store/slice/productItemSlice";
import { customer_search_key, product_search_key } from "@/helper/commonValues";

const AllProductsTable = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState([]);
  const [hideMe, setHideMe] = useState(false);
  const {
    selectedProducts,
    calcValues,
    subTotal,
    searchCustomer,
    selectedCustomer,
  } = useSelector(({ cart }) => cart);
  const { allProductList } = useSelector(({ productItem }) => productItem);
  const { allCustomerList } = useSelector(({ customer }) => customer);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );
  const allProductsData = allProductList?.list || [];

  const fetchList = useCallback(
    async (modal, start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: modal,
        search_key:
          modal === "Products" ? product_search_key : customer_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchList("Products", currentPage, pageLimit, searchParam);
    fetchList("Customers", currentPage, pageLimit, searchParam);
  }, []);

  const handleSearchInput = (e, modal) => {
    dispatch(setCurrentPage(1));

    fetchList(modal, currentPage, pageLimit, e.target.value?.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce((e, modal) => {
      handleSearchInput(e, modal);
    }, 800),
    []
  );

  const onPageChange = (page, modal) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;
      dispatch(setCurrentPage(pageIndex));
      fetchList(modal, pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page, modal) => {
    const list = modal === "Products" ? allProductList : allCustomerList;
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0 ? (list?.totalRows ? list?.totalRows : 0) : page;
    const prevPageValue =
      pageLimit === 0 ? (list?.totalRows ? list?.totalRows : 0) : pageLimit;
    if (prevPageValue < list?.totalRows || pageValue < list?.totalRows) {
      fetchList(modal, page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const header = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center  mt-0 product_select_content">
        <h6 className="m-0 inline products_name">Products:</h6>
        <IconField iconPosition="right" className="min-w-full min-h-10">
          <InputIcon className="pi pi-search mr-6" />
          <InputText
            autoComplete="off"
            id="search"
            placeholder={`${
              Object.keys(selectedCustomer)?.length
                ? "Search Products"
                : "Select Customer To Enable Search"
            }`}
            type="search"
            className="input_wrap small search_wrap"
            value={searchParam}
            onChange={(e) => {
              debounceHandleSearchInput(e, "Products");
              dispatch(setSearchParam(e.target.value));
            }}
            disabled={Object.keys(selectedCustomer).length === 0}
          />
        </IconField>
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      // <div className="flex align-items-center gap-2 max-w-1rem lg:max-w-1rem">
      //     <Image alt={rowData._id} src={rowData.image} height={100} width={100} style={{ objectFit: 'cover' }} className="max-w-1rem lg:max-w-1rem shadow-2 border-round rounded" />
      // </div>

      <div className="table_image">
        <Image
          src={rowData?.image || ""}
          alt={rowData?._id || "Image not found"}
          className="shadow-2 border-round table_img h-100 w-100 object-cover transition duration-300 ease-in-out hover:scale-110"
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  };

  const amountBody = (rowData) => {
    return parseFloat(rowData.amount || 0).toFixed(2);
  };

  const handleSelectProduct = (data) => {
    const updatedSelectedProducts = [...selectedProducts, data];
    const calSubTotal = parseFloat(
      updatedSelectedProducts?.reduce(
        (total, product) =>
          parseFloat(total || 0) + parseFloat(product?.amount || 0),
        0
      )
    ).toFixed(2);
    const afterDiscount = parseFloat(
      calSubTotal - parseFloat((calcValues.discount * calSubTotal) / 100)
    );
    dispatch(setSelectedProducts(updatedSelectedProducts));
    dispatch(setSubTotal(calSubTotal));
    dispatch(
      setCalcValues({
        ...calcValues,
        grandTotal: parseFloat(
          afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)
        ).toFixed(2),
      })
    );
    dispatch(setSearchParam(""));

    const i = allProductsData.findIndex((item) => {
      return item._id === data?._id;
    });

    if (i !== -1) {
      const updatedList = [
        ...allProductsData.slice(0, i),
        { ...allProductsData[i], qty: "", discount: "" },
        ...allProductsData.slice(i + 1),
      ];
      dispatch(
        setAllProductList({
          ...allProductList,
          list: [...allProductsData],
        })
      );
    }
  };

  const actionBodyTemplate = (data) => {
    return (
      <Button
        type="button"
        disabled={!data.qty || error[data?._id]}
        icon="pi pi-plus-circle"
        className="action-icon-size p-5"
        onClick={(e) => {
          handleSelectProduct(data);
        }}
        rounded
      ></Button>
    );
  };

  const multiBodyTemplate = (data) => {
    return (
      <div className="container flex flex-md-row flex-column responsive-table-product-card">
        {/* Centered Image */}
        <div className="flex justify-center card-image">
          <Image
            src={data.image}
            alt={data?._id}
            width={100}
            height={100}
            className="h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Bottom Sections */}
        {/* <div className="flex flex-1 bg-gray-900 "> */}
        <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
          {/* Left Section */}
          <div className="flex-1 lg:col-3 responsive-card-details-1 text-left">
            <p className="responsive-card-content">
              <span>Name:</span> {data.name}
            </p>
            <p className="responsive-card-content modal_input">
              <span>QTY: </span>
              {qtyBody(data)}
            </p>
            <p className="responsive-card-content ">
              <span>Available Quantity:</span> {data.available_quantity}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 lg:col-3 flex flex-col responsive-card-details-2 text-left">
            <p className="responsive-card-content modal_input">
              <span>Discount:</span> {discountBody(data)}
            </p>
            <p className="responsive-card-content">
              <span>MRP:</span> {data.selling_price}
            </p>
            <p className="responsive-card-content">
              <span>Amount:</span> {data.amount || 0}
            </p>
            <Button
              className="gradient_common_btn add_card_add_btn"
              type="button "
              disabled={!data.qty || error[data?._id]}
              onClick={(e) => {
                handleSelectProduct(data);
              }}
            >
              ADD
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const qtyBody = (data) => {
    const handleChange = (e) => {
      const value = parseInt(e.target.value || 0);
      const index = allProductsData?.findIndex(
        (product) => product._id === data?._id
      );
      const newProduct = [...allProductsData];
      const amount =
        value <= data.available_quantity
          ? value * parseFloat(data.selling_price)
          : data.amount;
      const discount = value <= data.available_quantity ? data.discount : 0;
      newProduct[index] = {
        ...newProduct[index],
        qty: value,
        amount: amount,
        discount: discount,
      };
      dispatch(setAllProductList({ ...allProductList, list: newProduct }));
      setError((prevErrors) => {
        const { [data?._id]: currentErrors = {} } = prevErrors;
        const { qty, ...remainingErrors } = currentErrors;
        if (Object.keys(remainingErrors).length === 0) {
          const { [data?._id]: _, ...otherErrors } = prevErrors;
          return otherErrors;
        }
        return {
          ...prevErrors,
          [data?._id]: remainingErrors,
        };
      });
      if (value > data.available_quantity) {
        setError((prevErrors) => ({
          ...prevErrors,
          [data?._id]: {
            ...prevErrors[data?._id],
            qty: `Only ${data.available_quantity} is Left`,
          },
        }));
      }
    };

    return (
      <>
        <InputText
          keyfilter="int"
          placeholder="Integers"
          disabled={!data.available_quantity || data.available_quantity === 0}
          value={data.qty === 0 ? "" : data.qty}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "minus") {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          className={` list_qty_input_fild ${
            error[data?._id]?.qty ? "border-red-500 border-2" : ""
          }`}
        />
        {error[data?._id]?.qty && (
          <small className="text-red-500 mt-1">{error[data?._id]?.qty}</small>
        )}
      </>
    );
  };

  const discountBody = (data) => {
    const handleChange = (e) => {
      const value = parseInt(e.target.value || 0);
      const index = allProductsData?.findIndex(
        (product) => product._id === data?._id
      );
      const newProduct = [...allProductsData];
      const ogAmt = parseInt(data.qty) * parseFloat(data.selling_price);
      const amount = value <= ogAmt ? (ogAmt - value).toFixed(2) : ogAmt;
      newProduct[index] = {
        ...newProduct[index],
        discount: value,
        amount: amount,
      };
      dispatch(setAllProductList({ ...allProductList, list: newProduct }));
      setError((prevErrors) => {
        const { [data?._id]: currentErrors = {} } = prevErrors;
        const { discount, ...remainingErrors } = currentErrors;
        if (Object.keys(remainingErrors).length === 0) {
          const { [data?._id]: _, ...otherErrors } = prevErrors;
          return otherErrors;
        }
        return {
          ...prevErrors,
          [data?._id]: remainingErrors,
        };
      });

      if (value > ogAmt) {
        setError((prevErrors) => ({
          ...prevErrors,
          [data?._id]: {
            ...prevErrors[data?._id],
            discount: `Equal or Less Than ${ogAmt}`,
          },
        }));
      }
    };

    return (
      <>
        <InputText
          keyfilter="int"
          placeholder="Integers"
          disabled={
            !data.available_quantity ||
            data.available_quantity === 0 ||
            !data.selling_price ||
            !data.qty ||
            error[data?._id]?.qty
          }
          value={data.discount === 0 ? "" : data.discount}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "minus") {
              e.preventDefault();
            }
          }}
          onBlur={handleChange}
          onChange={(e) => {
            const value = parseInt(e.target.value || 0);
            const index = allProductsData?.findIndex(
              (product) => product._id === data?._id
            );
            const newProduct = [...allProductsData];
            newProduct[index] = { ...newProduct[index], discount: value };
            dispatch(
              setAllProductList({ ...allProductList, list: newProduct })
            );
          }}
          className={`list_qty_input_fild ${
            error[data?._id]?.discount ? "border-red-500 border-2" : ""
          }`}
        />
        {error[data?._id]?.discount && (
          <small className="text-red-500 mt-1">
            {error[data?._id]?.discount}
          </small>
        )}
      </>
    );
  };

  const customerBodyTemplate = (data) => {
    return (
      <div className="customer_list_table w-100">
        <div className="container-fluidflex flex-col w-full responsive-table-product-card">
          {/* Bottom Sections */}
          <div className="flex responsive-card-partition">
            {/* Left Section */}
            <div className="flex-1 responsive-card-details-1 text-start">
              <p className="responsive-card-content m-0">
                <span>Name:</span> {data.name}
              </p>
              <p className="responsive-card-content m-0">
                <span>Email:</span> {data.email}
              </p>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex flex-col responsive-card-details-2">
              {/* <p className='text-left'>MRP: {data.selling_price}</p> */}
              <Button
                className="gradient_common_btn select_btn"
                type="button"
                disabled={error[data?._id]}
                onClick={(e) => {
                  dispatch(setSelectedCustomer(data));
                  dispatch(setSearchCustomer(data?.name));
                  setHideMe(false);
                }}
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const header2 = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center mb-0 pb-0">
        <h6 className="m-0 inline customer_name">Customer:</h6>
        <IconField iconPosition="right" className="min-w-full min-h-10 inline">
          <InputIcon className="pi pi-search mr-6" />
          <InputText
            autoComplete="off"
            id="search"
            placeholder="Search Customer"
            type="search"
            className="input_wrap small search_wrap"
            value={searchCustomer}
            onChange={(e) => {
              debounceHandleSearchInput(e, "Customers");
              dispatch(setSearchCustomer(e.target.value || ""));
              dispatch(setSelectedCustomer({}));
              setHideMe(true);
              if (!e.target.value) {
                setHideMe(false);
              }
            }}
          />
        </IconField>
      </div>
    );
  };

  return (
    <>
      {/* {commonLoading && <Loader />} */}

      <div className="card main_cart_box">
        <DataTable
          value={hideMe === "" ? [{}] : allCustomerList?.list}
          header={header2}
          rows={10}
        >
          {hideMe ? (
            <Column
              headerStyle={{
                width: "8rem",
                textAlign: "center",
                margin: "0",
                padding: "0",
              }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={customerBodyTemplate}
            />
          ) : null}
        </DataTable>

        {hideMe && (
          <CustomPaginator
            dataList={allProductsData}
            pageLimit={pageLimit}
            onPageChange={(page) => onPageChange(page, "Products")}
            onPageRowsChange={(page) => onPageRowsChange(page, "Products")}
            currentPage={currentPage}
            totalCount={allProductList?.totalRows}
          />
        )}

        <DataTable
          className="max-xl:hidden"
          value={
            searchParam === ""
              ? [{}]
              : allProductsData?.filter(
                  (p) => !selectedProducts?.some((s) => s?._id === p._id)
                )
          }
          header={header}
          rows={10}
        >
          {searchParam ? (
            <Column header="" body={imageBodyTemplate} className="pl-5" />
          ) : null}
          {searchParam ? <Column header="Name" field="name" /> : null}
          {searchParam ? (
            <Column
              header="Qty"
              field="qty"
              body={qtyBody}
              style={{ minWidth: "14rem" }}
            />
          ) : null}
          {searchParam ? (
            <Column header="Available Quantity" field="available_quantity" />
          ) : null}
          {searchParam ? (
            <Column
              header="Discount"
              field="discount"
              body={discountBody}
              style={{ minWidth: "14rem" }}
            />
          ) : null}
          {searchParam ? (
            <Column header="MRP" field="selling_price" sortable />
          ) : null}
          {searchParam ? (
            <Column header="Amount" field="amount" body={amountBody} />
          ) : null}
          {searchParam ? (
            <Column
              headerStyle={{ textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          ) : null}
        </DataTable>
        <DataTable
          className="block xl:hidden"
          value={
            searchParam === ""
              ? [{}]
              : allProductsData?.filter(
                  (p) => !selectedProducts?.some((s) => s._id === p._id)
                )
          }
          header={header}
          rows={10}
        >
          {searchParam ? (
            <Column
              headerStyle={{ width: "8rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={multiBodyTemplate}
            />
          ) : null}
        </DataTable>
        {searchParam && (
          <CustomPaginator
            dataList={allProductsData}
            pageLimit={pageLimit}
            onPageChange={(page) => onPageChange(page, "Customers")}
            onPageRowsChange={(page) => onPageRowsChange(page, "Customers")}
            currentPage={currentPage}
            totalCount={allProductList?.totalRows}
          />
        )}
      </div>
    </>
  );
};

export default AllProductsTable;
