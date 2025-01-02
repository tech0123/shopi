"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import SalesTableDialog from "./SalesTableDialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import {
  setAllSalesListData,
  setSalesItemSearchParam,
  setSalesTableData,
} from "@/store/slice/salesSlice";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import {
  calculateTotal,
  convertIntoNumber,
  customer_search_key,
  getFormattedDate,
  product_search_key,
  sales_search_key,
} from "@/helper/commonValues";
import {
  addItem,
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  updateItem,
} from "@/store/slice/commonSlice";
import CommonDeleteConfirmation from "@/helper/CommonComponent/CommonDeleteConfirmation";
import Image from "next/image";

const intialDialogState = {
  product: "",
  quantity: "",
  selling_price: "",
  cost_price: "",
  tax: "",
  description: "",
  unique_id: "",
};

const schema = yup.object().shape({
  customer: yup.string().required("Please enter Customer Name."),
  sales_date: yup.string().required("Please enter Sales Date."),
  email: yup.string().required("Please enter email"),
  bill_no: yup.string().required("Please enter Bill No."),
  type: yup.string().required("Please select Customer Type."),
  mobile_number: yup.string().required("Please enter Mobile Number."),
  address: yup.string().required("Please enter Address."),
});

const inputFieldsList = [
  {
    fieldTitle: "Sales Date",
    fieldId: "SalesDate",
    fieldName: "sales_date",
    type: "date",
    min_date: new Date(),
    isRequired: true,
  },
  {
    fieldTitle: "Bill No",
    fieldId: "BillNo",
    fieldName: "bill_no",
    isRequired: true,
  },
  {
    fieldTitle: "Customer Type",
    fieldId: "CustomerType",
    fieldName: "type",
    isRequired: true,
  },
  {
    fieldTitle: "Email",
    fieldId: "Email",
    fieldName: "email",
    isRequired: true,
  },
  {
    fieldTitle: "Mobile Number",
    fieldId: "Mobile Number",
    fieldName: "mobile_number",
    isRequired: true,
  },
  {
    fieldTitle: "Address",
    fieldId: "Address",
    fieldName: "address",
    isRequired: true,
  },
];

const tableColumns = [
  { field: "product_name", header: "Product Name" },
  { field: "quantity", header: "Quantity" },
  { field: "selling_price", header: "Selling Price" },
  { field: "cost_price", header: "Cost Price" },
  { field: "tax", header: "Tax" },
  { field: "description", header: "Description" },
];

const CommonAddEditSales = (props) => {
  const { initialValue } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { salesId } = useParams();

  const [salesTableDialog, setSalesTableDialog] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [selectedSalesItemData, setSelectedSalesItemData] = useState(
    intialDialogState
  );

  const { allCustomerList } = useSelector(({ customer }) => customer);
  const { allProductList } = useSelector(({ productItem }) => productItem);
  const { salesTableData } = useSelector(({ sales }) => sales);
  const { searchParam, pageLimit, currentPage } = useSelector(
    ({ common }) => common
  );

  const fetchSalesList = useCallback(
    async (key_name, start = 1, limit = 7, search = "") => {
      const payload = {
        start: start,
        limit: limit,
        search: search?.trim(),
        modal_to_pass: key_name,
        search_key:
          key_name === "Products" ? product_search_key : customer_search_key,
      };
      dispatch(getAllDataList(payload));
    },
    []
  );

  useEffect(() => {
    fetchSalesList("Customers", 0, 0);
    fetchSalesList("Products");
  }, []);

  useEffect(() => {
    methods.reset(initialValue);
  }, [initialValue]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValue,
  });

  const values = methods.getValues();

  const customerOptions = useMemo(() => {
    if (allCustomerList?.list?.length) {
      const data = allCustomerList?.list?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));
      return data;
    }
  }, [allCustomerList]);

  useEffect(() => {
    if (salesTableData?.length) {
      const calculated_subTotal = calculateTotal(salesTableData, "cost_price");
      const current_discount = values?.discount ? values?.discount : 0;
      const current_tax = values?.tax ? values?.tax : 0;
      const calculated_tax =
        ((calculated_subTotal - current_discount) * current_tax) / 100;
      const calculated_total_amount =
        calculated_subTotal - current_discount - calculated_tax;

      const obj = {
        sub_total: convertIntoNumber(calculated_subTotal),
        total_amount: convertIntoNumber(calculated_total_amount),
        sales_record_table: salesTableData,
      };
      methods.reset((prev) => ({ ...prev, ...obj }));
    }
  }, [salesTableData]);

  const onSubmit = async (data) => {
    let res = "";

    const updatedSalesItemsTableData = data?.sales_record_table?.map((item) => {
      const { unique_id, ...rest } = item;
      return rest;
    });
    const findManufacturerObj = customerOptions?.find(
      (item) => item?.value === data?.customer
    );

    let payload = {
      ...data,
      modal_to_pass: "sales",
      search_key: sales_search_key,
      customer_name: findManufacturerObj?.label,
      sales_record_table: updatedSalesItemsTableData,
      sales_date: getFormattedDate(data?.purchase_date),
    };

    if (salesId) {
      res = await dispatch(updateItem(payload));
    } else {
      res = await dispatch(addItem(payload));
    }

    if (res?.payload) {
      dispatch(setAllSalesListData(res?.payload));
      router.push("/sales");
    }
  };

  const handleCustomerChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;

    const findCustomerData = allCustomerList?.list?.find((item) => {
      return item?._id === value;
    });
    const fieldsObj = {
      [name]: value,
      type: findCustomerData?.type,
      email: findCustomerData.email,
      address: findCustomerData?.address,
      mobile_number: findCustomerData?.mobile_number,
    };
    methods.reset((prev) => ({ ...prev, ...fieldsObj }));
  };

  const onPageChange = (page, modal) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchSalesList(modal, pageIndex, pageLimit);
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
      fetchSalesList(modal, page === 0 ? 0 : 1, page);
    }
  };

  const hideDeleteDialog = () => {
    setDeleteItemDialog(false);
  };

  const handleDeleteProduct = () => {
    const updatedSalesTableData = salesTableData?.filter(
      (item) => item?.unique_id !== selectedSalesItemData?.unique_id
    );
    dispatch(setSalesTableData(updatedSalesTableData));
    hideDeleteDialog();
  };

  const deleteProductDialogFooter = (
    <div className="d-flex justify-end gap-4">
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={handleDeleteProduct}
      />
    </div>
  );

  const handleEditItem = async (product) => {
    fetchSalesList("Sales");
    setSalesTableDialog(true);
    setSelectedSalesItemData(product);
    dispatch(setSalesItemSearchParam(product?.product_name));
  };

  const handleDeleteItem = async (product) => {
    setDeleteItemDialog(true);
    setSelectedSalesItemData(product);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={(e) => {
            e.preventDefault();
            handleEditItem(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteItem(rowData);
          }}
        />
      </>
    );
  };

  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="container flex flex-md-row flex-column product-card">
        <div className="flex justify-center card-image">
          <Image
            src={rowData?.image || ""}
            alt={rowData?._id || "Image not found"}
            // className="card-img w-100 h-100 object-cover transition duration-300 ease-in-out hover:scale-110"
            className="card-img w-100 object-cover object-center h-100 transition duration-300 ease-in-out hover:scale-110"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-1 flex-col flex-md-row card-partition">
          <div className="flex-1 p-2 personal-details">
            <p className="text-left text-sm">ID: {rowData.id}</p>
            <p className="text-left text-sm">Name: {rowData.name}</p>
            <p className="text-left text-sm product-description">
              Description: {rowData.description}
            </p>
            <p className="text-left text-sm">
              Available Qty: {rowData.available_quantity}
            </p>
          </div>
          <div className="flex-1 p-2 flex flex-col card-details">
            <p className="text-left text-sm">Discount: {rowData.discount}</p>
            <p className="text-left text-sm">Tax: {rowData.tax}</p>
            <p className="text-left text-sm">
              Selling Price: {rowData.selling_price}
            </p>
            <p className="text-left text-sm">
              Cost Price: {rowData.cost_price}
            </p>
            <div className="text-left mt-1">{actionBodyTemplate(rowData)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <div className="m-5 text-xl text-slate-300"> */}
      <div className="modal_title">{salesId ? "Edit" : "Add"} Sales Item</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form_container">
            <Row>
              <Col lg={3}>
                <CommonInputText
                  type="single_select"
                  title="Customer"
                  id="Customer"
                  name="customer"
                  options={customerOptions}
                  isRequired={true}
                  fieldOnChange={(e) => {
                    e.preventDefault();
                    handleCustomerChange(e);
                  }}
                />
                {/* <DataTable
                  className='!p-0 modal_datatable menu_facturers_data'
                  value={showHideManufacturer === "" ? [{}] : allManufacturerList?.list} header={header} rows={10}
                >
                  {showHideManufacturer ? <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ overflow: 'visible', padding:"0 !important" }} body={multiBodyTemplate} /> : null}
                </DataTable> */}
                {/* {showHideManufacturer &&
                  <CustomPaginator
                    dataList={allManufacturerList?.list}
                    pageLimit={pageLimit}
                    onPageChange={(page) => onPageChange(page, "Manufacturers")}
                    onPageRowsChange={(page) => onPageRowsChange(page, "Manufacturers")}
                    currentPage={currentPage}
                    totalCount={allProductList?.totalRows}
                  />
                } */}
              </Col>
              {inputFieldsList.map((field, i) => {
                return (
                  <Col lg={3} key={i}>
                    <CommonInputText
                      minDate={field?.min_date}
                      type={field?.type}
                      id={field?.fieldId}
                      name={field?.fieldName}
                      body={field?.fieldBody}
                      options={field?.options}
                      title={field?.fieldTitle}
                      isRequired={field?.isRequired}
                      fieldOnChange={field?.fieldOnChange}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
          <div className="d-flex justify-end main_modal_add_btn ">
            <Button
              className="btn_primary gradient_common_btn modal_add_btn"
              onClick={(e) => {
                e.preventDefault();
                setSalesTableDialog(true);
                setSelectedSalesItemData(intialDialogState);
                dispatch(setSalesItemSearchParam(""));
              }}
            >
              + Add
            </Button>
          </div>
          <div>
            <div className="table_wrapper">
              <DataTable
                className="max-xl:hidden"
                value={salesTableData}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
              >
                {tableColumns?.map((column, i) => {
                  return (
                    <Column
                      key={i}
                      field={column?.field}
                      header={column?.header}
                      body={column?.body}
                      sortable
                      style={{ minWidth: "12rem" }}
                    />
                  );
                })}
                <Column
                  header="Action"
                  body={actionBodyTemplate}
                  exportable={false}
                  style={{ minWidth: "12rem" }}
                />
              </DataTable>
              <DataTable
                value={salesTableData}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="mt-10 block xl:hidden"
              >
                <Column
                  body={responsiveTableTemplete}
                  style={{ minWidth: "12rem" }}
                />
              </DataTable>
            </div>
            <div>
              <Row>
                <Col xxl={4} xl={5} lg={6}>
                  <div>
                    <div className="amount_content">
                      <Row className="flex justify-between align-items-center mb-2">
                        <Col lg={6}>
                          <span>Sub Total</span>
                        </Col>
                        <Col lg={6}>
                          <span>{values?.sub_total}</span>
                        </Col>
                      </Row>
                      <Row className="flex justify-between align-items-center">
                        <Col lg={6}>
                          <span>Discount</span>
                        </Col>
                        <Col lg={6}>
                          <CommonInputText
                            type="number"
                            id="Discount"
                            name="discount"
                            className="mb-0"
                            placeholder="Discount"
                            disabled={!salesTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(
                                salesTableData,
                                "cost_price"
                              );
                              const current_discount = e?.value ? e?.value : 0;
                              const current_tax = values?.tax ? values?.tax : 0;
                              const calculated_tax =
                                ((calculated_subTotal - current_discount) *
                                  current_tax) /
                                100;

                              const calculated_total_amount =
                                calculated_subTotal -
                                current_discount -
                                calculated_tax;

                              const obj = {
                                sub_total: convertIntoNumber(
                                  calculated_subTotal
                                ),
                                total_amount: convertIntoNumber(
                                  calculated_total_amount
                                ),
                                sales_record_table: salesTableData,
                              };

                              methods.reset((prev) => ({ ...prev, ...obj }));
                              methods.setValue("discount", current_discount, {
                                shouldValidate: true,
                              });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="flex justify-between align-items-center mb-2">
                        <Col lg={6}>
                          <span>Tax</span>
                        </Col>
                        <Col lg={6}>
                          <CommonInputText
                            id="Tax"
                            name="tax"
                            type="number"
                            placeholder="Tax"
                            className="mb-0"
                            disabled={!salesTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(
                                salesTableData,
                                "cost_price"
                              );
                              const current_discount = values?.discount
                                ? values?.discount
                                : 0;
                              const current_tax = e?.value ? e?.value : 0;
                              const calculated_tax =
                                ((calculated_subTotal - current_discount) *
                                  current_tax) /
                                100;
                              const calculated_total_amount =
                                calculated_subTotal -
                                current_discount -
                                calculated_tax;

                              const obj = {
                                sales_record_table: salesTableData,
                                sub_total: convertIntoNumber(
                                  calculated_subTotal
                                ),
                                total_amount: convertIntoNumber(
                                  calculated_total_amount
                                ),
                              };

                              methods.reset((prev) => ({ ...prev, ...obj }));
                              methods.setValue("tax", current_tax, {
                                shouldValidate: true,
                              });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="flex justify-between align-items-center mb-2">
                        <Col lg={6}>
                          <span>Total Amount</span>
                        </Col>
                        <Col lg={6}>
                          <span>{values?.total_amount}</span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          {/* <div className="me-10 flex justify-end items-center gap-3 mb-5"> */}
          <div className="me-10 flex justify-end items-center gap-3 mb-5 main_modal_btn_grup_group">
            <Button
              className="btn_transparent"
              onClick={(e) => {
                e.preventDefault();
                router.push("/sales");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn_primary gradient_common_btn">
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
      <SalesTableDialog
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        setSalesTableDialog={setSalesTableDialog}
        salesTableDialog={salesTableDialog}
        intialDialogState={intialDialogState}
        selectedSalesItemData={selectedSalesItemData}
      />
      <CommonDeleteConfirmation
        open={deleteItemDialog}
        hideContent={hideDeleteDialog}
        footerContent={deleteProductDialogFooter}
      />
    </>
  );
};

export default CommonAddEditSales;
