"use client";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  setDeleteCustomerDialog,
  setCustomerDialog,
  setSelectedCustomerData,
} from "@/store/slice/customerSlice";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import {
  addItem,
  deleteItem,
  getAllDataList,
  getSingleItem,
  updateItem,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import Loader from "@/helper/CommonComponent/Loader";
import {
  customerTypeOptions,
  customer_search_key,
} from "@/helper/commonValues";
import Image from "next/image";
import { Tooltip } from "primereact/tooltip";
import CommonImageDialog from "@/helper/CommonComponent/CommonImageDialog";

const initialState = {
  image: "",
  name: "",
  email: "",
  mobile_number: "",
  type: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Please enter Name."),
  email: yup.string().email().required("Please enter Email."),
  mobile_number: yup.string().required("Please enter Mobile Number."),
  type: yup.string().required("Please enter Type."),
});

const imageBodyTemplate = (rowData) => {
  return (
    // <Image
    //     src={rowData?.image || ''}
    //     alt={rowData?._id || "Image not found"}
    //     className="shadow-2 border-round"
    //     width={150}
    //     height={150}
    //     style={{ objectFit: "cover" }}
    // />

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

const tableColumns = [
  { field: "image", header: "Image", body: imageBodyTemplate },
  { field: "name", header: "Name" },
  { field: "email", header: "Email" },
  { field: "mobile_number", header: "Mobile Number" },
  { field: "type", header: "Type" },
];

const inputFieldsList = [
  {
    fieldTitle: "Name",
    fieldId: "Name",
    fieldName: "name",
    fieldRequired: true,
  },
  {
    fieldTitle: "Email",
    fieldId: "Email",
    fieldName: "email",
    fieldRequired: true,
  },
  {
    fieldTitle: "Mobile Number",
    fieldId: "MobileNumber",
    fieldName: "mobile_number",
    fieldRequired: true,
  },
  {
    fieldTitle: "Type",
    fieldId: "Type",
    fieldName: "type",
    type: "single_select",
    options: customerTypeOptions,
    fieldRequired: true,
  },
  { fieldTitle: "Image", fieldId: "Image", fieldName: "image" },
];

const CustomerList = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialog, setImageDialog] = useState(false);
  const {
    allCustomerList,
    selectedCustomerData,
    customerDialog,
    deleteCustomerDialog,
  } = useSelector(({ customer }) => customer);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedCustomerData,
  });

  const fetchCustomersData = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Customers",
        search_key: customer_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCustomersData(currentPage, pageLimit, searchParam);
  }, []);

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchCustomersData(pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page) => {
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0
        ? allCustomerList?.totalRows
          ? allCustomerList?.totalRows
          : 0
        : page;
    const prevPageValue =
      pageLimit === 0
        ? allCustomerList?.totalRows
          ? allCustomerList?.totalRows
          : 0
        : pageLimit;
    if (
      prevPageValue < allCustomerList?.totalRows ||
      pageValue < allCustomerList?.totalRows
    ) {
      fetchCustomersData(page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const onSubmit = async (data) => {
    let res = "";
    const payload = {
      ...data,
      type: Number(data.type),
      modal_to_pass: "customer",
      search_key: customer_search_key,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };

    if (data?._id) {
      res = await dispatch(updateItem(payload));
    } else {
      res = await dispatch(addItem(payload));
    }
    if (res?.payload) {
      dispatch(setCustomerDialog(false));
    }
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchCustomersData(currentPage, pageLimit, e.target.value?.trim());
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
    dispatch(setSelectedCustomerData(initialState));
    methods.reset(initialState);
    dispatch(setCustomerDialog(true));
  };

  const handleEditItem = async (customer) => {
    const payload = { modal_to_pass: "customer", id: customer };

    dispatch(setCustomerDialog(true));
    const res = await dispatch(getSingleItem(payload));

    if (res?.payload) {
      methods.reset(res?.payload);
    }
  };

  const handleDeleteItem = (customer) => {
    dispatch(setSelectedCustomerData(customer));
    methods.reset(customer);
    dispatch(setDeleteCustomerDialog(true));
  };

  const hideProductDeleteDialog = () => {
    dispatch(setDeleteCustomerDialog(false));
  };

  const handleDeleteProduct = async () => {
    const payload = {
      modal_to_pass: "customer",
      search_key: customer_search_key,
      id: selectedCustomerData?._id,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };
    const res = await dispatch(deleteItem(payload));
    if (res?.payload) {
      dispatch(setDeleteCustomerDialog(false));
    }
  };

  const actionBodyResponsiveTemplate = (rowData) => {
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

  const handleImageClick = (rowData) => {
    setSelectedImage(rowData.image); // Store the image of the clicked row
    setImageDialog(true); // Open the dialog
  };

  const responsiveTableTemplete = (rowData) => {
    console.log(rowData.image, "rowData");

    return (
      <div className="container flex flex-md-row flex-column responsive-table-product-card">
        <div
          className="flex justify-center card-image customers_image customers_image"
          onClick={() => handleImageClick(rowData)}
        >
          <Image
            src={rowData?.image || ""}
            alt={rowData?._id || "Image not found"}
            width={100}
            height={100}
            className="card-img w-100 object-cover object-center 
            h-100 transition duration-300 ease-in-out hover:scale-110"
          />
        </div>

        {/* <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
          <div className="flex-1 lg:col-3 responsive-card-details-1">
            {/* <p className="text-left text-sm">Name: {rowData?.name}</p> *
            <p className="responsive-card-content">
              <span>Name:</span> {rowData.name}
            </p>

            <p className="responsive-card-content">
              <span>Email:</span> {rowData?.email}
            </p>
            <p className="responsive-card-content">
              <span>Mobile Number: </span>
              {rowData?.mobile_number}
            </p>
          </div>
          <div className="flex-1 lg:col-3 flex flex-col responsive-card-details-2">
            <p className="responsive-card-content">
              <span>Type:</span> {rowData?.type}
            </p>
            <div className="text-left mt-1">
              {actionBodyResponsiveTemplate(rowData)}
            </div>
          </div>
        </div> */}

        <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
          <div className="flex-1 lg:col-3 responsive-card-details-1">
            {/* <p className="text-left text-sm">Name: {rowData?.name}</p> */}
            <p className="responsive-card-content">
              <span>Name:</span> {rowData.name}
            </p>

            {/* <p className="responsive-card-content">
              <span>Email:</span> {rowData?.email}
            </p> */}
            <Tooltip target=".tooltipClass" />
            <span
              className="tooltipClass"
              data-pr-tooltip={rowData.description}
              data-pr-position="top"
            >
              <p className="text-left text-sm product-description text-truncate responsive-card-content">
                <span>Email:</span> {rowData?.email}
              </p>
            </span>

            <p className="responsive-card-content">
              <span>Mobile Number: </span>
              {rowData?.mobile_number}
            </p>
          </div>
          <div className="flex-1 lg:col-3 flex flex-col responsive-card-details-2">
            <p className="responsive-card-content">
              <span>Type:</span> {rowData?.type}
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
      {commonLoading && <Loader />}
      <CommonDataTable
        tableName="Customers"
        moduleName="customer"
        tableColumns={tableColumns}
        allItemList={allCustomerList}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deleteCustomerDialog}
        hideDeleteDialog={hideProductDeleteDialog}
        deleteItem={handleDeleteProduct}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
        selectedImage={selectedImage}
        handleImageClick={handleImageClick}
      />

      <Dialog
        visible={customerDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch("_id") ? "Edit" : "Add"} Customer`}
        modal
        className="p-fluid common_modal"
        draggable={false}
        onHide={() => dispatch(setCustomerDialog(false))}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="form_container">
              <Row>
                {inputFieldsList.map((field, i) => {
                  return (
                    <Col lg={6} key={i}>
                      <CommonInputText
                        id={field.fieldId}
                        title={field.fieldTitle}
                        type={field.type}
                        options={field.options}
                        name={field.fieldName}
                        isRequired={field.fieldRequired}
                        className={field.class}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="mt-3 me-2 flex justify-content-end items-center gap-4 modal_footer_gap_btn_group">
              <Button
                className="btn_transparent"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setCustomerDialog(false));
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
      </Dialog>

      {/* Common Image Dialog */}
      <CommonImageDialog
        setImageDialog={setImageDialog}
        imageDialog={imageDialog}
        selectedImage={selectedImage}
      />
    </>
  );
};
export default CustomerList;
