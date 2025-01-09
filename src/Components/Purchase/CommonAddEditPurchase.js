"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import PurchaseTableDialog from "./PurchaseTableDialog";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import {
  addItem,
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
  updateItem,
} from "@/store/slice/commonSlice";
import CommonDeleteConfirmation from "@/helper/CommonComponent/CommonDeleteConfirmation";
import {
  setAllPurchaseListData,
  setPurchaseTableData,
} from "@/store/slice/purchaseSlice";
import {
  calculateTotal,
  default_search_key,
  manufacturer_search_key,
  convertIntoNumber,
  getFormattedDate,
  product_search_key,
} from "@/helper/commonValues";
import {
  setFieldSearchParam,
  setManufacturerOptions,
  setManufactureSearchParam,
  setSelectedManufacturerData,
} from "@/store/slice/manufacturerSlice";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import CustomPaginator from "@/helper/CommonComponent/CustomPaginator";
import Image from "next/image";
import { setAllProductsData } from "@/store/slice/cartSlice";
import { Dropdown } from "primereact/dropdown";
import { Tooltip } from "primereact/tooltip";

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
  // purchase_record_table: yup.array().of(
  //     yup.object({
  //         product: yup.string().required(),
  //         quantity: yup.number().required(),
  //         selling_price: yup.string().required(),
  //         cost_price: yup.string().required(),
  //         tax: yup.string().required(),
  //         description: yup.string().required(),
  //     })
  //   ).required(),
  manufacturer: yup.string().required("Please enter Manufacturer Name."),
  purchase_date: yup.string().required("Please enter Purchase Date."),
  bill_no: yup.string().required("Please enter Bill Number"),
  gst_no: yup.string().required("Please enter GST Number."),
  mobile_number: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits.")
    .required("Please enter Mobile Number."),
  address: yup.string().required("Please enter Address."),
});

const tableColumns = [
  { field: "product_name", header: "Product Name" },
  { field: "quantity", header: "Quantity" },
  { field: "selling_price", header: "Selling Price" },
  { field: "cost_price", header: "Cost Price" },
  { field: "tax", header: "Tax" },
  { field: "description", header: "Description" },
];

const inputFieldsList = [
  // {
  //   fieldTitle:"Manufacturer",
  //   fieldId:"Manufacturer",
  //   fieldName:'manufacturer',
  //   type:'single_select',
  //   options: manufacturerOptions,
  //   isRequired:true,
  //   fieldOnChange:{handleManufacturerChange}
  // },
  {
    fieldTitle: "Purchase Date",
    fieldId: "PurchaseDate",
    fieldName: "purchase_date",
    type: "date",
    isRequired: true,
  },
  {
    fieldTitle: "Bill No",
    fieldId: "BillNo",
    fieldName: "bill_no",
    isRequired: true,
  },
  {
    fieldTitle: "GST No",
    fieldId: "GSTNo",
    fieldName: "gst_no",
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

const CommonAddEditPurchase = (props) => {
  const { initialValue } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { purchaseId } = useParams();

  const [purchaseTableDialog, setPurchaseTableDialog] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(
    intialDialogState
  );
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  // const [showHideManufacturer, setShowHideManufacturer] = useState(false)
  // const [manufacturerOptions, setManufacturerOptions] = useState([])
  // const [productOptions, setProductOptions] = useState([]);

  const { purchaseTableData } = useSelector(({ purchase }) => purchase);
  const { pageLimit, currentPage } = useSelector(({ common }) => common);
  const { allProductList } = useSelector(({ productItem }) => productItem);
  const { allManufacturerList, manufactureSearchParam } = useSelector(
    ({ manufacturer }) => manufacturer
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValue,
  });

  const values = methods.getValues();

  const handleManufacturerChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;

    const findManufacturerData = allManufacturerList?.list?.find((item) => {
      return item?._id === value;
    });
    const fieldsObj = {
      [name]: value,
      address: findManufacturerData?.address,
      mobile_number: findManufacturerData?.mobile_number,
      gst_no: findManufacturerData?.gst_no,
    };
    methods.reset(fieldsObj);
  };

  const manufacturerOptions = useMemo(() => {
    if (allManufacturerList?.list?.length) {
      const data = allManufacturerList?.list?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));
      return data;
    }
  }, [allManufacturerList]);

  const fetchPurchaseList = useCallback(
    async (key_name, start = 1, limit = 7, search = "") => {
      const payload = {
        start: start,
        limit: limit,
        search: search?.trim(),
        modal_to_pass: key_name,
        search_key:
          key_name === "Products"
            ? product_search_key
            : manufacturer_search_key,
      };
      const res = await dispatch(getAllDataList(payload));
    },
    []
  );

  useEffect(() => {
    fetchPurchaseList("Manufacturers", 0, 0);
    fetchPurchaseList("Products");
  }, []);

  useEffect(() => {
    methods.reset(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (purchaseTableData?.length) {
      const calculated_subTotal = calculateTotal(
        purchaseTableData,
        "cost_price"
      );
      const current_discount = values?.discount ? values?.discount : 0;
      const current_tax = values?.tax ? values?.tax : 0;
      const calculated_tax =
        ((calculated_subTotal - current_discount) * current_tax) / 100;
      const calculated_total_amount =
        calculated_subTotal - current_discount - calculated_tax;

      const obj = {
        sub_total: convertIntoNumber(calculated_subTotal),
        total_amount: convertIntoNumber(calculated_total_amount),
        purchase_record_table: purchaseTableData,
      };
      methods.reset((prev) => ({ ...prev, ...obj }));
    }
  }, [purchaseTableData]);

  const onSubmit = async (data) => {
    let res = "";
    console.log("data", data);
    const updatedPurchaseItemsTableData = data?.purchase_record_table?.map(
      (item) => {
        const { unique_id, ...rest } = item;
        return rest;
      }
    );
    const findManufacturerObj = manufacturerOptions?.find(
      (item) => item?.value === data?.manufacturer
    );

    let payload = {
      ...data,
      modal_to_pass: "purchase",
      search_key: default_search_key,
      manufacturer_name: findManufacturerObj?.label,
      purchase_record_table: updatedPurchaseItemsTableData,
      purchase_date: getFormattedDate(data?.purchase_date),
    };

    if (purchaseId) {
      res = await dispatch(updateItem(payload));
    } else {
      res = await dispatch(addItem(payload));
    }

    if (res?.payload) {
      dispatch(setAllPurchaseListData(res?.payload));
      router.push("/purchase");
    }
  };

  const hideDeleteDialog = () => {
    setDeleteItemDialog(false);
  };

  const handleAddPurchaseItem = () => {
    setPurchaseTableDialog(true);
    setSelectedPurchaseData(intialDialogState);

    //   const filteredProductOptions = allProductList?.list?.map((item) => {
    //     const filteredProductData = purchaseTableData.every((data) => { return data?.product !== item?._id && item })

    //     if (!purchaseTableData?.length || filteredProductData) {
    //       return {
    //         label: item?.name,
    //         value: item?._id
    //       }
    //     }
    //   }).filter((item) => item)

    //   setProductOptions(filteredProductOptions)
  };

  const handleEditItem = async (product) => {
    fetchPurchaseList("Products");
    setPurchaseTableDialog(true);
    setSelectedPurchaseData(product);
  };

  const handleDeleteItem = async (product) => {
    setDeleteItemDialog(true);
    setSelectedPurchaseData(product);
  };

  const actionBodyTemplateIcon = (rowData) => {
    return (
      <div className="responsivecard-btn-group">
        <Button
          icon="pi pi-pencil"
          className="edit_btn"
          onClick={() => handleEditItem(rowData)}
        >
          {/* Edit */}
        </Button>
        <Button
          icon="pi pi-trash"
          className="delete_btn"
          onClick={() => handleDeleteItem(rowData)}
        >
          {/* Delete5 */}
        </Button>
      </div>
    );
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="responsivecard-btn-group">
        <Button
          className="edit_btn gradient_common_btn"
          onClick={() => handleEditItem(rowData)}
        >
          Edit
        </Button>
        <Button
          className="delete_btn gradient_common_btn"
          onClick={() => handleDeleteItem(rowData)}
        >
          Delete
        </Button>
      </div>
    );
  };

  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="container flex flex-md-row flex-column product-card responsive-table-product-card">
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
        <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
          <div className="flex-1 responsive-card-details-1">
            <p className="responsive-card-content">
              <span>ID: </span>
              {rowData.id}
            </p>
            <p className="responsive-card-content">
              <span>Name: </span>
              {rowData.name}
            </p>
            {/* <p className="responsive-card-content product-description">
              <span>Description:</span> {rowData.description}
            </p> */}
            <Tooltip target=".tooltipClass" />
            <span
              className="tooltipClass"
              data-pr-tooltip={rowData.description}
              data-pr-position="top"
            >
              <p className="text-left text-sm product-description text-truncate responsive-card-content">
                <span>Description: </span>
                {rowData.description}
              </p>
            </span>
            <p className="responsive-card-content">
              <span>Available Qty: </span>
              {rowData.available_quantity}
            </p>
          </div>
          <div className="flex-1 flex flex-col responsive-card-details-2">
            <p className="responsive-card-content">
              <span>Discount: </span>
              {rowData.discount}
            </p>
            <p className="responsive-card-content">
              <span>Tax:</span> {rowData.tax}
            </p>
            <p className="responsive-card-content">
              <span>Selling Price:</span> {rowData.selling_price}
            </p>
            <p className="responsive-card-content">
              <span>Cost Price:</span> {rowData.cost_price}
            </p>
            <div className="text-left mt-1">{actionBodyTemplate(rowData)}</div>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteProduct = () => {
    const updatedPurchaseTableData = purchaseTableData?.filter(
      (item) => item?.unique_id !== selectedPurchaseData?.unique_id
    );
    dispatch(setPurchaseTableData(updatedPurchaseTableData));
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

  const onPageChange = (page, modal) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchPurchaseList(modal, pageIndex, pageLimit);
    }
  };

  const onPageRowsChange = (page, modal) => {
    const list = modal === "Products" ? allProductList : allManufacturerList;
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0 ? (list?.totalRows ? list?.totalRows : 0) : page;
    const prevPageValue =
      pageLimit === 0 ? (list?.totalRows ? list?.totalRows : 0) : pageLimit;
    if (prevPageValue < list?.totalRows || pageValue < list?.totalRows) {
      fetchPurchaseList(modal, page === 0 ? 0 : 1, page);
    }
  };

  // const handleManufactureChange = (item) => {
  //   const value = item?._id
  //   setShowHideManufacturer(false)

  //   const fieldsObj = {
  //     ...item,
  //     product: value,
  //     selling_price: ""
  //   }

  //   dispatch(setManufactureSearchParam(item?.name))
  //   dispatch(setSelectedManufacturerData(fieldsObj))
  //   methods.reset(fieldsObj);
  // }

  // const header = () => {
  //   return (
  //     <div className="flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
  //         <IconField iconPosition="right" className='min-w-full min-h-10'>
  //             <InputIcon className="pi pi-search mr-3" />
  //               <InputText
  //                 id="Search"
  //                 placeholder="Search Manufacturer"
  //                 type="search"
  //                 className="input_wrap small search_wrap"
  //                 value={manufactureSearchParam}
  //                 onChange={(e) => {
  //                   debounceHandleSearchInput(e);
  //                   dispatch(setManufactureSearchParam(e.target.value));
  //                   dispatch(setSelectedManufacturerData({}))
  //                   setShowHideManufacturer(true)
  //                   if (!e.target.value) {
  //                     setShowHideManufacturer(false)
  //                   }
  //                 }}
  //                 disabled={purchaseId}
  //               />
  //         </IconField>
  //     </div>
  //   );
  // };

  // const multiBodyTemplate = (data) => {
  //   return (
  //     <div className="container flex flex-col w-full">
  //         <div className="flex justify-center p-1">
  //             <Image src={data.image} alt={data?._id} width={150} height={150} />
  //         </div>
  //         <div className="flex flex-1 bg-gray-900 amount_content mt-2">
  //             <div className="flex-1 p-3">
  //                 <p className='text-left'>Name: {data.name}</p>
  //                 <p className='text-left'>Code: {data?.code}</p>
  //                 <div className="flex justify-center">
  //                   <Button
  //                     className="btn_primary"
  //                     onClick={(e) => {
  //                       e.preventDefault();
  //                       handleManufactureChange(data)
  //                     }}
  //                     >
  //                     ADD
  //                   </Button>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  //   );
  // };

  // const handleSearchInput = e => {
  //   dispatch(setCurrentPage(1));

  //   fetchPurchaseList(
  //     'Manufacturers',
  //     currentPage,
  //     pageLimit,
  //     e.target.value?.trim(),
  //   );
  // };

  // const debounceHandleSearchInput = useCallback(
  //   _.debounce(e => {
  //       handleSearchInput(e);
  //   }, 800),
  //   [],
  // );

  // const [filterManufacturerOptions, setFilterManufacturerOptions] = useState([]);
  // const [filterValue, setFilterValue] = useState("");

  // const { control, register, setValue, watch } = methods;

  // const handleFilterChange = (event) => {
  //   const input = event.originalEvent.target.value;

  //   if (input) {
  //     setFilterValue(input);
  //     const filtered = manufacturerOptions.filter(manufacturer =>
  //       manufacturer.label.toLowerCase().includes(input.toLowerCase())
  //     );
  //     setFilterManufacturerOptions(filtered);
  //   } else {
  //     setFilterManufacturerOptions([]);
  //   }

  // };

  return (
    <>
      <div className="modal_title">
        {purchaseId ? "Edit" : "Add"} Purchase Item
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form_container">
            <Row>
              <Col lg={3}>
                <CommonInputText
                  type="single_select"
                  title="Manufacturer"
                  id="Manufacturer"
                  name="manufacturer"
                  options={manufacturerOptions}
                  isRequired={true}
                  fieldOnChange={(e) => {
                    e.preventDefault();
                    handleManufacturerChange(e);
                  }}
                />
                {/* <div className="card flex justify-content-center">
                  <Dropdown
                    filter
                    id="Manufacturer"
                    name='manufacturer'
                    options={filterManufacturerOptions}
                    value={watch("manufacturer")}
                    placeholder="Select a Manufacturer"
                    onChange={(e) => {
                      e.preventDefault();
                      handleManufacturerChange(e);
                    }}
                    optionLabel="label"
                    filterBy="label"
                    showClear
                    onFilter={handleFilterChange}
                    className="w-full md:w-14rem"
                  />
                </div> */}

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
          <div className=" d-flex justify-end main_modal_add_btn ">
            <Button
              className="btn_primary gradient_common_btn"
              onClick={(e) => {
                e.preventDefault();
                handleAddPurchaseItem();
                dispatch(setSearchParam(""));
                dispatch(setAllProductsData([]));
              }}
            >
              + Add
            </Button>
          </div>
          <div>
            <div className="table_wrapper">
              <DataTable
                className="max-xl:hidden"
                value={purchaseTableData}
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
                  body={actionBodyTemplateIcon}
                  exportable={false}
                  style={{ minWidth: "12rem" }}
                />
              </DataTable>
              <DataTable
                value={purchaseTableData}
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
                  <div className="amount_content ">
                    <div className="">
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
                            disabled={!purchaseTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(
                                purchaseTableData,
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
                                purchase_record_table: purchaseTableData,
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
                            disabled={!purchaseTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(
                                purchaseTableData,
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
                                purchase_record_table: purchaseTableData,
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
          <div className="me-10 flex justify-end items-center gap-3 mb-5">
            <Button
              className="btn_transparent"
              onClick={(e) => {
                e.preventDefault();
                router.push("/purchase");
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
      <PurchaseTableDialog
        intialDialogState={intialDialogState}
        purchaseTableDialog={purchaseTableDialog}
        selectedPurchaseData={selectedPurchaseData}
        setPurchaseTableDialog={setPurchaseTableDialog}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
      />
      <CommonDeleteConfirmation
        open={deleteItemDialog}
        hideContent={hideDeleteDialog}
        footerContent={deleteProductDialogFooter}
      />
    </>
  );
};

export default memo(CommonAddEditPurchase);
