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
import { memo, useCallback, useEffect } from "react";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import Image from "next/image";
import { product_search_key } from "@/helper/commonValues";

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

  const {
    allProductList,
    productDialog,
    selectedProductData,
    deleteProductDialog,
  } = useSelector(({ productItem }) => productItem);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );

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
      <>
        <Button
          className="text-left text-sm bg-white text-black px-2 py-1 m-1"
          onClick={() => handleEditItem(rowData)}
        >
          Edit
        </Button>
        <Button
          className="text-left text-sm bg-white text-black px-2 py-1 m-1"
          onClick={() => handleDeleteItem(rowData)}
        >
          Delete
        </Button>
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
      />

      <Dialog
        visible={productDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch("_id") ? "Edit" : "Add"} Product`}
        modal
        className="p-fluid common_modal"
        onHide={() => dispatch(setProductDialog(false))}
        draggable={false}
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
            <div className="mt-3 me-2 flex justify-end items-center gap-4">
              <Button
                className="btn_transparent"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setProductDialog(false));
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn_primary">
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
};
export default memo(ProductList);
