"use client";
import * as yup from "yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { Col, Row } from "react-bootstrap";
import Loader from "@/helper/CommonComponent/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import {
  addItem,
  getSingleItem,
  updateItem,
  deleteItem,
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import {
  setDeleteProductDialog,
  setSelectedProductData,
  setProductDialog,
} from "@/store/slice/productItemSlice";
import { memo, useCallback, useEffect, useState } from "react";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import Image from "next/image";
import { product_search_key } from "@/helper/commonValues";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";
import CommonImageDialog from "@/helper/CommonComponent/CommonImageDialog";

const initialState = {
  image: "",
  name: "",
  description: "",
  available_quantity: "",
  discount: "",
  tax: "",
  selling_price: "",
  cost_price: "",
};

const schema = yup.object().shape({
  name: yup.string().required("Please enter Name."),
  description: yup.string().required("Please enter Description."),
  available_quantity: yup.string().required("Please enter Available Quantity."),
  discount: yup.string().required("Please enter Discount."),
  tax: yup.string().required("Please enter Tax."),
  selling_price: yup.string().required("Please enter Selling Price."),
  cost_price: yup.string().required("Please enter Cost Price."),
});

const imageBodyTemplate = (rowData) => {
  return (
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
  { field: "id", header: "Id" },
  { field: "name", header: "Name" },
  { field: "description", header: "Description" },
  { field: "available_quantity", header: "Available Quantity" },
  { field: "discount", header: "Discount" },
  { field: "tax", header: "Tax" },
  { field: "selling_price", header: "Selling Price" },
  { field: "cost_price", header: "Cost Price" },
];

const inputFieldsList = [
  {
    fieldTitle: "Name",
    fieldId: "Name",
    fieldName: "name",
    fieldRequired: true,
  },
  {
    fieldTitle: "Description",
    fieldId: "Description",
    fieldName: "description",
    fieldRequired: true,
  },
  {
    fieldTitle: "Available Quantity",
    fieldId: "AvailableQuantity",
    fieldName: "available_quantity",
    fieldRequired: true,
  },
  {
    fieldTitle: "Discount",
    fieldId: "Discount",
    fieldName: "discount",
    fieldRequired: true,
  },
  { fieldTitle: "Tax", fieldId: "Tax", fieldName: "tax", fieldRequired: true },
  {
    fieldTitle: "Selling Price",
    fieldId: "SellingPrice",
    fieldName: "selling_price",
    fieldRequired: true,
  },
  {
    fieldTitle: "Cost Price",
    fieldId: "CostPrice",
    fieldName: "cost_price",
    fieldRequired: true,
  },
  { fieldTitle: "Image", fieldId: "Image", fieldName: "image" },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialog, setImageDialog] = useState(false);
  const {
    allProductList,
    productDialog,
    selectedProductData,
    deleteProductDialog,
  } = useSelector(({ productItem }) => productItem);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );
  const handleImageClick = (rowData) => {
    setSelectedImage(rowData.image); // Store the image of the clicked row
    setImageDialog(true); // Open the dialog
  };

  const fetchProductList = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Products",
        search_key: product_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchProductList(currentPage, pageLimit, searchParam);
  }, []);

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;
      dispatch(setCurrentPage(pageIndex));
      fetchProductList(pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page) => {
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0
        ? allProductList?.totalRows
          ? allProductList?.totalRows
          : 0
        : page;
    const prevPageValue =
      pageLimit === 0
        ? allProductList?.totalRows
          ? allProductList?.totalRows
          : 0
        : pageLimit;
    if (
      prevPageValue < allProductList?.totalRows ||
      pageValue < allProductList?.totalRows
    ) {
      fetchProductList(page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedProductData,
  });

  const onSubmit = async (data) => {
    let res = "";
    const payload = {
      ...data,
      modal_to_pass: "product",
      search_key: product_search_key,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };

    // if (productImageState) {
    //   const base64Image = await fileToBase64(productImageState);
    //   payload = { ...payload, image: base64Image }
    // }

    if (data?._id) {
      res = await dispatch(updateItem(payload));
    } else {
      res = await dispatch(addItem(payload));
    }
    if (res?.payload) {
      dispatch(setProductDialog(false));
    }
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchProductList(currentPage, pageLimit, e.target.value?.trim());
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
    dispatch(setSelectedProductData(initialState));
    // dispatch(setProductImageState(null));
    methods.reset(initialState);
    dispatch(setProductDialog(true));
  };

  const handleEditItem = async (product) => {
    dispatch(setProductDialog(true));
    // dispatch(setProductImageState(null));
    const payload = { modal_to_pass: "product", id: product };
    const res = await dispatch(getSingleItem(payload));
    if (res?.payload) {
      methods.reset(res?.payload);
    }
  };

  const handleDeleteItem = (product) => {
    dispatch(setSelectedProductData(product));
    methods.reset(product);
    dispatch(setDeleteProductDialog(true));
  };

  const hideProductDeleteDialog = () => {
    dispatch(setDeleteProductDialog(false));
  };

  const handleDeleteProduct = async () => {
    const payload = {
      modal_to_pass: "product",
      search_key: product_search_key,
      id: selectedProductData?._id,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };
    const res = await dispatch(deleteItem(payload));
    if (res?.payload) {
      dispatch(setDeleteProductDialog(false));
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
  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="container flex flex-md-row flex-column responsive-table-product-card">
        <div
          className="flex justify-center card-image"
          onClick={() => handleImageClick(rowData)}
        >
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
          <div className="flex-1 lg:col-3 responsive-card-details-1">
            <p className="responsive-card-content">
              <span>ID:</span> {rowData.id}
            </p>
            <p className="responsive-card-content">
              <span>Name:</span> {rowData.name}
            </p>
            <Tooltip target=".tooltipClass" />
            <span
              className="tooltipClass"
              data-pr-tooltip={rowData.description}
              data-pr-position="top"
            >
              <p className="text-left text-sm product-description text-truncate responsive-card-content">
                <span>Description:</span> {rowData.description}
              </p>
            </span>
            <p className="responsive-card-content">
              <span>Available Qty:</span> {rowData.available_quantity}
            </p>
          </div>
          {/*<Skeleton width="75%"></Skeleton> */}
          <div className="flex-1 lg:col-3 flex flex-col responsive-card-details-2">
            <p className="responsive-card-content">
              <span>Discount:</span> {rowData.discount}
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
      {/* {commonLoading && <Loader />} */}
      <CommonDataTable
        tableName="Products"
        moduleName="product"
        tableColumns={tableColumns}
        allItemList={allProductList}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deleteProductDialog}
        hideDeleteDialog={hideProductDeleteDialog}
        deleteItem={handleDeleteProduct}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
        handleImageClick={handleImageClick}
      />
      <Dialog
        visible={productDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch("_id") ? "Edit" : "Add"} Product`}
        modal
        className="p-fluid common_modal"
        draggable={false}
        onHide={() => dispatch(setProductDialog(false))}
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
                        name={field.fieldName}
                        isRequired={field.fieldRequired}
                      />
                    </Col>
                  );
                })}
              </Row>

              {/* <div class="file-upload">
                <label for="file-upload" class='custom-file-upload  bg-black text-white  font-bold py-2 px-4 rounded shadow-md hover:bg-cyan-600 cursor-pointer'>
                  {productImageState ? 'Uploaded' : selectedProductData?._id ? 'Change Image' : "Choose Image"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  class="hidden"
                  name="file"
                  disabled={productImageState}
                  onChange={(e) => dispatch(setProductImageState(e.target.files?.[0]))}
                />
              </div> */}
            </div>
            <div className="mt-3 me-2 flex justify-content-end items-center gap-4 modal_btn_group">
              <Button
                className="btn_transparent"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setProductDialog(false));
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

      {/* Common Image Dilog */}
      <CommonImageDialog
        setImageDialog={setImageDialog}
        imageDialog={imageDialog}
        selectedImage={selectedImage}
      />
    </>
  );
};
export default memo(ProductList);
