"use client";
import { memo, useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import Image from "next/image";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { getAllProductList, setAllProductList } from "@/store/slice/productItemSlice";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { addItem, getAllDataList, getSingleItem, updateItem } from "@/store/slice/commonSlice";
import Loader from "@/helper/CommonComponent/Loader";

const initialState = {
    image: "",
    name: "",
    description: "",
    available_quantity: "",
    discount: "",
    tax: "",
    selling_price: "",
    cost_price: ""
  };

const schema = yup.object().shape({
  name: yup.string().required("Please enter Name."),
  description: yup.string().required("Please enter Description."),
  available_quantity: yup.string().required("Please enter Available Quantity."),
  discount: yup.string().required("Please enter Discount."),
  tax: yup.string().required("Please enter Tax."),
  selling_price: yup.string().required("Please enter Selling Price."),
  cost_price: yup.string().required("Please enter Cost Price.")
});

const getSeverity = product => {
  switch (product.inventoryStatus) {
    case "INSTOCK":
      return "success";
    case "LOWSTOCK":
      return "warning";
    case "OUTOFSTOCK":
      return "danger";
    default:
      return null;
  }
};

const imageBodyTemplate = rowData => {
  return (
    <img
      src={`https://primefaces.org/cdn/primereact/images/product/${rowData?.image}`}
      alt={rowData.image}
      className="shadow-2 border-round"
      style={{ width: "64px" }}
    />
  );
};

const tableColumns = [
  {field: 'image', header:"Image", body:{imageBodyTemplate}},
  {field: 'id', header:"Id"},
  {field: 'name', header:"Name"},
  {field: 'description', header:"Description"},
  {field: 'available_quantity', header:"Available Quantity"},
  {field: 'discount', header:"Discount"},
  {field: 'tax', header:"Tax"},
  {field: 'selling_price', header:"Selling Price"},
  {field: 'cost_price', header:"Cost Price"},
]

const inputFieldsList = [
  {fieldTitle:"Name", fieldId:"Name",fieldName:'name', fieldRequired:true},
  {fieldTitle:"Description", fieldId:"Description",fieldName:'description', fieldRequired:true},
  {fieldTitle:"Available Quantity", fieldId:"AvailableQuantity",fieldName:'available_quantity', fieldRequired:true},
  {fieldTitle:"Discount", fieldId:"Discount",fieldName:'discount', fieldRequired:true},
  {fieldTitle:"Tax", fieldId:"Tax",fieldName:'tax', fieldRequired:true},
  {fieldTitle:"Selling Price", fieldId:"SellingPrice",fieldName:'selling_price', fieldRequired:true},
  {fieldTitle:"Cost Price", fieldId:"CostPrice",fieldName:'cost_price', fieldRequired:true},
]

const ProductCrud = () => {
  const dispatch = useDispatch();

  const [productDialog, setProductDialog] = useState(false);
  const [productData, setProductData] = useState(initialState);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  const {allProductList } = useSelector(({productItem}) => productItem)
  const {commonLoading } = useSelector(({common}) => common)

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: productData
  });

  const fetchProductList = useCallback(async () => {
    const payload = {modal_to_pass:"Products"}
    const res = await dispatch(getAllDataList(payload))
    if(res){
      dispatch(setAllProductList(res))
    }
  },[])

  useEffect(() => {
    fetchProductList()
  }, []);

  const onSubmit = async (data) => {
    let res='';
    const payload = { 
      ...data,
      modal_to_pass:"product"
    }

    if(data?._id){
      res = await dispatch(updateItem(payload))
    } else {
      res = await dispatch(addItem(payload))
    }
    if(res){
      dispatch(setAllProductList(res))
      setProductDialog(false)
    }
  };

  const handleAddItem = () => {
    setProductData(initialState);
    methods.reset(initialState);
    setProductDialog(true);
  };

  const handleEditItem = async (product) => {
    setProductDialog(true);
    const payload = {modal_to_pass:"product", id: product?._id}
    const res = await dispatch(getSingleItem(payload))
    
    if(res){
      setProductData(res);
      methods.reset(res);
    }
  };

  const handleDeleteItem = product => {
    setProductData(product);
    methods.reset(product);
    setDeleteProductDialog(true);
  };

  const actionBodyResponsiveTemplate = rowData => {
    return (
      <>
        <p className="text-left text-sm" onClick={() => handleEditItem(rowData)}>
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
          <Image
            src={`/${rowData.image}`}
            alt="image"
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex-1 border-r-2 border-white p-2">
            <p className="text-left text-sm">
              ID: {rowData.id}
            </p>
            <p className="text-left text-sm">
              Name: {rowData.name}
            </p>
            <p className="text-left text-sm">
              Description: {rowData.description}
            </p>
            <p className="text-left text-sm">
              Available Qty: {rowData.available_quantity}
            </p>
          </div>
          <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
            <p className="text-left text-sm">
              Discount: {rowData.discount}
            </p>
            <p className="text-left text-sm">
              Tax: {rowData.tax}
            </p>
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
    {commonLoading && <Loader/>}
    <div>
      <CommonDataTable
        tableName="Products" 
        tableColumns={tableColumns}
        allItemList={allProductList}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        selectedItemName={productData?.name}
        selectedItemData={productData}
        setSelectedItemData={setProductData}
        deleteItemDialog={deleteProductDialog}
        setDeleteItemDialog={setDeleteProductDialog}
        responsiveTableTemplete={responsiveTableTemplete}
      />

      <Dialog
        visible={productDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch('_id') ? 'Edit' : "Add"} Product`}
        modal
        className="p-fluid"
        onHide={() => setProductDialog(false)}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="form_container">
              <Row>
              {inputFieldsList.map((field,i) => {
                return(
                  <Col lg={6} key={i}>
                    <CommonInputText
                      id={field.fieldId}
                      title={field.fieldTitle}
                      name={field.fieldName}
                      isRequired={field.fieldRequired}
                    />
                  </Col>
                )
              })}
              </Row>
            </div>
            <div className="mt-3 me-2 flex justify-end items-center gap-4">
              <Button
                className="btn_transperent"
                onClick={e => {
                  e.preventDefault();
                  setProductDialog(false);
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
    </div>
    </>
  );
}
export default memo(ProductCrud)