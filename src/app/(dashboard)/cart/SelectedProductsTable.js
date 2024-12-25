"use client";
import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { calcInitialValues, default_search_key } from "@/helper/commonValues";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedProducts,
  setSelectedCustomer,
  setCalcValues,
  setSubTotal,
  setModeOfPayment,
} from "@/store/slice/cartSlice";
import Image from "next/image";
import { Accordion, AccordionTab } from "primereact/accordion";
import "@/app/(dashboard)/cart/cart.css";
import { Dropdown } from "primereact/dropdown";
import {
  setCurrentPage,
  setSearchParam,
  setPageLimit,
  getAllDataList,
  addItem,
} from "@/store/slice/commonSlice";
import _ from "lodash";
import jwt from "jsonwebtoken";

const SelectedProductsTable = () => {
  const dispatch = useDispatch();
  const {
    selectedProducts,
    subTotal,
    calcValues,
    modeOfPayment,
    selectedCustomer,
  } = useSelector(({ cart }) => cart);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );
  const [error, setError] = useState([]);

  const modeOfPaymentOptions = [
    { name: "Cash", value: "cash" },
    { name: "Online Payment", value: "online" },
  ];

  const fetchProductList = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Products",
        search_key: ["name", "description", "selling_price"],
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));
    },
    []
  );

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchProductList(currentPage, pageLimit, e.trim());
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce((e) => {
      handleSearchInput(e);
    }, 800),
    []
  );

  const Footer = () => {
    const handleCalcValueChange = (value, name) => {
      const parsedValue = parseFloat(value || 0);
      let grandTotal = 0;

      if (name === "tax") {
        const afterDiscount = parseFloat(
          subTotal - parseFloat((calcValues.discount * subTotal) / 100)
        );
        grandTotal = parseFloat(
          afterDiscount + parseFloat((parsedValue * afterDiscount) / 100)
        ).toFixed(2);
      } else {
        const afterDiscount = parseFloat(
          subTotal - parseFloat((parsedValue * subTotal) / 100)
        );
        grandTotal = parseFloat(
          afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)
        ).toFixed(2);
      }

      dispatch(
        setCalcValues({
          ...calcValues,
          [name]: value,
          grandTotal: grandTotal,
        })
      );
    };

    const handleBilling = async (e) => {
      console.log(
        "payload",
        selectedProducts,
        modeOfPayment,
        subTotal,
        calcValues
      );
      const productBillingData =
        selectedProducts?.length > 0
          ? selectedProducts?.map((item) => {
              return {
                cost_price: item?.cost_price || 0,
                description: item?.description || "",
                product: "fd",
                product_id: item?._id,
                name: item?.name || "",
                quantity: item?.qty || 0,
                selling_price: item?.selling_price || 0,
                tax: item?.tax || 0,
              };
            })
          : [];
      const payload = {
        // totalAmount: calcValues?.totalAmount,
        // mode_of_payment: modeOfPayment,
        // customer_id: selectedCustomer?._id,
        modal_to_pass: "purchase",
        search_key: default_search_key,
        address: "re",
        amount: 0,
        bill_no: "5",
        discount: calcValues?.discount,
        gst_no: "dwef",
        manufacturer: "d",
        manufacturer_name: "c",
        mobile_number: "9632587412",
        purchase_date: new Date(),
        purchase_record_table: productBillingData,
        qty: 0,
        sub_total: "0",
        tax: calcValues?.tax,
        total_amount: calcValues.grandTotal,
      };
      const res = await dispatch(addItem(payload));
      try {
        const res = await fetch("/api/auth/getAuthId", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error in Fetching Employee ID:", error);
      }
    };

    //         // try {
    //         //     const response = await fetch("/api/auth/getAuthId", {
    //         //         method: "GET",
    //         //         headers: {
    //         //             "Content-Type": "application/json"
    //         //         },
    //         //     });

    //         //     // Check if the request was successful
    //         //     if (!response) {
    //         //         throw new Error(`HTTP error! status: ${response.status}`);
    //         //     }

    //         //     // Parse the response as JSON
    //         //     const data = await response.json();
    //         // } catch (error) {
    //         //     console.error("Error:", error);
    //         //     throw error;
    //         // }

    // };

    return (
      <div className="card !bg-gray-800 shadow-sm text-white p-5 pt-4">
        <hr className=" mb-20" />
        {/* <h5 className="text-md  font-medium mb-2">Summary</h5> */}

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className=" text-sm">SubTotal:</span>
            <InputNumber
              className="input_number  bg-gray-800 border-gray-600"
              maxFractionDigits={2}
              useGrouping={false}
              value={subTotal}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className=" text-sm">Discount:</span>
            <InputNumber
              placeholder="Discount"
              name="discount"
              className="input_number  bg-gray-800 border-gray-600"
              maxFractionDigits={2}
              useGrouping={false}
              value={calcValues?.discount}
              onValueChange={(e) =>
                handleCalcValueChange(e.target.value, e.target.name)
              }
              disabled={
                !selectedProducts?.length ||
                searchParam ||
                Object.keys(selectedCustomer)?.length === 0
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <span className=" text-sm">Tax:</span>
            <InputNumber
              placeholder="Tax"
              name="tax"
              className="input_number  bg-gray-800 border-gray-600"
              maxFractionDigits={2}
              useGrouping={false}
              value={calcValues?.tax}
              onValueChange={(e) =>
                handleCalcValueChange(e.target.value, e.target.name)
              }
              disabled={
                !selectedProducts?.length ||
                searchParam ||
                Object.keys(selectedCustomer)?.length === 0
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <span className=" text-sm">Grand Total:</span>
            {/* <span className="font-medium text-sm">{calcValues.grandTotal}</span> */}
            <InputNumber
              className="input_number  bg-gray-800 border-gray-600"
              maxFractionDigits={2}
              useGrouping={false}
              value={calcValues.grandTotal}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <hr className="mt-20 mb-10" />

        <div className="flex justify-between items-center">
          <span className="text-sm">Mode of Payment:</span>
          <span className="text-sm font-light">
            <Dropdown
              value={modeOfPayment}
              onChange={(e) => dispatch(setModeOfPayment(e.value))}
              options={modeOfPaymentOptions}
              optionLabel="name"
              disabled={
                Object.keys(selectedCustomer)?.length === 0 || searchParam
              }
              placeholder="Select Mode of Payment"
              className="m-0 text-sm"
            />
          </span>
        </div>

        <div className="flex justify-center items-center mt-12 w-full">
          <Button
            type="button"
            className="px-4 py-2 mx-2 bg-gray-900 rounded-lg"
            disabled={
              !selectedProducts?.length ||
              Object.keys(selectedCustomer).length === 0
            }
            onClick={(e) => handleBilling(e)}
          >
            Save
          </Button>
          {/* <Button type="button" className='px-4 py-2 mx-2 bg-gray-900 rounded-lg' disabled={!selectedProducts?.length} onClick={(e) => { console.log('print') }}>Print</Button> */}
        </div>
      </div>
    );
  };

  const PreviouslyOrderedTable = () => {
    return (
      <Accordion className="gap-2 mx-5 mt-5">
        <AccordionTab header="Previously Bought Products">
          {selectedProducts?.length > 0 ? (
            selectedProducts.map((product, index) => (
              <div
                key={index}
                className="p-2 flex flex-col sm:flex-row justify-between items-center sm:items-start"
              >
                <p className="m-0 max-sm:text-center">
                  <strong>{product.name}</strong>
                  <br />
                  Qty: {product.qty} | Price: {product.selling_price}
                </p>
                <Button
                  type="button"
                  icon="pi pi-plus-circle"
                  className="action-icon-size sm:mt-0"
                  onClick={() => {
                    dispatch(setSearchParam(product.name.trim()));
                    handleSearchInput(product.name.trim());
                    // debounceHandleSearchInput("kevDia")
                  }}
                  rounded
                />
              </div>
            ))
          ) : (
            <p>No previously bought products.</p>
          )}
        </AccordionTab>
      </Accordion>
    );
  };

  const handleUnselectProduct = (data) => {
    const remainingSelectedProducts = selectedProducts?.filter(
      (item) => item._id !== data?._id
    );
    const calcSubTotal = parseFloat(
      remainingSelectedProducts?.reduce(
        (total, product) =>
          parseFloat(total || 0) + parseFloat(product.amount || 0),
        0
      )
    ).toFixed(2);
    const afterDiscount = parseFloat(
      calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)
    );
    dispatch(setSelectedProducts(remainingSelectedProducts));
    dispatch(setSubTotal(calcSubTotal));
    if (remainingSelectedProducts?.length) {
      dispatch(
        setCalcValues({
          ...calcValues,
          grandTotal: parseFloat(
            afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)
          ).toFixed(2),
        })
      );
    } else {
      dispatch(setCalcValues(calcInitialValues));
    }
  };

  const amountBody = (rowData) => {
    return parseFloat(rowData?.amount).toFixed(2);
  };

  const actionBodyTemplate = (data) => {
    return (
      <Button
        type="button"
        disabled={!data?.qty}
        icon="pi pi-minus-circle"
        className="action-icon-size p-5"
        onClick={(e) => {
          handleUnselectProduct(data);
        }}
        rounded
      ></Button>
    );
  };

  const multiBodyTemplate = (data) => {
    return (
      <div className="container flex flex-col  w-full">
        <div className="flex justify-center p-3">
          <Image src={data?.image} alt={data?._id} width={100} height={100} />
        </div>

        <div className="flex flex-1 bg-gray-900">
          <div className="flex-1  p-3">
            {/* <p className='text-left'>Date: {new Date(data?.date).toLocaleDateString()}</p> */}
            <p className="text-left">Name: {data?.name}</p>
            <p className="text-left">QTY: {qtyBody(data)}</p>
            <p className="text-left">Stock: {data?.available_quantity}</p>
          </div>

          <div className="flex-1 p-3 flex flex-col ">
            <p className="text-left">Discount: {discountBody(data)}</p>
            <p className="text-left">MRP: {data?.selling_price}</p>
            <p className="text-left">Amount: {data?.amount}</p>
            <Button
              type="button"
              onClick={(e) => {
                handleUnselectProduct(data);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const qtyBody = (data) => {
    const handleChange = (e) => {
      const value = parseInt(e.target.value || 0);
      const index = selectedProducts?.findIndex(
        (customer) => customer._id === data?._id
      );
      const newCustomers = [...selectedProducts];
      const amount =
        value <= data?.available_quantity
          ? value * parseFloat(data?.selling_price)
          : data?.amount;
      const discount = value <= data?.available_quantity ? data?.discount : 0;
      newCustomers[index] = {
        ...newCustomers[index],
        qty: value,
        amount: amount,
        discount: discount,
      };
      dispatch(setSelectedProducts(newCustomers));

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
      if (value > data?.available_quantity) {
        setError((prevErrors) => ({
          ...prevErrors,
          [data?._id]: {
            ...prevErrors[data?._id],
            qty: `Only ${data?.available_quantity} is Left`,
          },
        }));
      }
      const calcSubTotal = parseFloat(
        newCustomers?.reduce(
          (total, product) =>
            parseFloat(total || 0) + parseFloat(product.amount || 0),
          0
        )
      ).toFixed(2);
      dispatch(setSubTotal(calcSubTotal));
      const afterDiscount = parseFloat(
        calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)
      );
      const grandTotal = parseFloat(
        afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)
      ).toFixed(2);

      dispatch(
        setCalcValues({
          ...calcValues,
          grandTotal: grandTotal,
        })
      );
    };

    return (
      <>
        <InputText
          name="qty"
          keyfilter="int"
          placeholder="Quantity"
          disabled={!data?.available_quantity || data?.available_quantity === 0}
          value={data?.qty === 0 ? "" : data?.qty}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "minus") {
              e.preventDefault();
            }
          }}
          onChange={handleChange}
          className={`h-10 p-3 ${
            error[data?._id]?.qty ? "border-red-500 border-2" : ""
          }`}
        />
        {error[data?._id]?.qty && (
          <p className="text-red-500 mt-1">{error[data?._id]?.qty}</p>
        )}
      </>
    );
  };

  const discountBody = (data) => {
    const handleChange = (e) => {
      const value = parseInt(e.target.value || 0);
      const index = selectedProducts?.findIndex(
        (customer) => customer._id === data?._id
      );
      const newCustomers = [...selectedProducts];
      const ogAmt = parseInt(data?.qty) * parseFloat(data?.selling_price);
      const amount = value <= ogAmt ? (ogAmt - value).toFixed(2) : ogAmt;
      newCustomers[index] = {
        ...newCustomers[index],
        discount: value,
        amount: amount,
      };
      dispatch(setSelectedProducts(newCustomers));
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

      const calcSubTotal = parseFloat(
        newCustomers?.reduce(
          (total, product) =>
            parseFloat(total || 0) + parseFloat(product.amount || 0),
          0
        )
      ).toFixed(2);
      dispatch(setSubTotal(calcSubTotal));
      const afterDiscount = parseFloat(
        calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)
      );
      const grandTotal = parseFloat(
        afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)
      ).toFixed(2);

      dispatch(
        setCalcValues({
          ...calcValues,
          grandTotal: grandTotal,
        })
      );
    };

    return (
      <>
        <InputText
          name="discount"
          keyfilter="int"
          placeholder="Discount"
          disabled={
            !data?.available_quantity ||
            data?.available_quantity === 0 ||
            !data?.selling_price ||
            !data?.qty ||
            error[data?._id]?.qty
          }
          value={data?.discount === 0 ? "" : data?.discount}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "minus") {
              e.preventDefault();
            }
          }}
          onBlur={handleChange}
          onChange={(e) => {
            const value = parseInt(e.target.value || 0);
            const index = selectedProducts?.findIndex(
              (customer) => customer._id === data?._id
            );
            const newCustomers = [...selectedProducts];
            newCustomers[index] = { ...newCustomers[index], discount: value };
            dispatch(setSelectedProducts(newCustomers));
          }}
          className={`h-10 p-3 ${
            error[data?._id]?.discount ? "border-red-500 border-2" : ""
          }`}
        />
        {error[data?._id]?.discount && (
          <p className="text-red-500 mt-1">{error[data?._id]?.discount}</p>
        )}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      // <div className="flex align-items-center gap-2 max-w-1rem lg:max-w-1rem">
      //     <Image alt={rowData?._id} src={rowData?.image} height={150} width={150} style={{ maxWidth: "4rem" }} className="max-w-1rem lg:max-w-1rem shadow-2 border-round" />
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

  return (
    <div className="card !border-none !bg-gray-800">
      <h6>Products Added:</h6>
      <div
        className={` ${
          searchParam || Object.keys(selectedCustomer)?.length === 0
            ? "!hidden"
            : ""
        }`}
      >
        <DataTable
          className="max-xl:hidden mx-5"
          value={selectedProducts}
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No Products Found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column header="" body={imageBodyTemplate} className="pl-5" />
          <Column header="Name" field="name" />
          <Column
            header="Qty"
            field="qty"
            body={qtyBody}
            style={{ minWidth: "14rem" }}
          />
          <Column header="Stock" field="available_quantity" />
          <Column
            header="Discount"
            field="discount"
            body={discountBody}
            style={{ minWidth: "14rem" }}
          />
          <Column header="MRP" field="selling_price" sortable />
          <Column header="Amount" field="amount" body={amountBody} />
          <Column
            headerStyle={{ textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>

        <DataTable
          className="block xl:hidden"
          value={selectedProducts}
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No Products found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            headerStyle={{ width: "8rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={multiBodyTemplate}
          />
        </DataTable>
        <PreviouslyOrderedTable />
      </div>
      <Footer />
    </div>
  );
};

export default SelectedProductsTable;
