"use client";
import React, { memo, useState } from "react";
import { Button } from "primereact/button";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { Col, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import PurchaseTableDialog from "../PurchaseTableDialog";
import CommonDeleteConfirmation from "@/helper/CommonComponent/CommonDeleteConfirmation";
import { setPurchaseTableData } from "@/store/slice/purchaseSlice";

const initialState = {
    manufacturer_name:'',
    purchase_date:'',
    bill_no : '',
    gst_no : '',
    mobile_number : '',
    address: '',
    purchase_record_table: [],
};

const intialDialogState = {
    product_name: "",
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
    //         product_name: yup.string().required(),
    //         quantity: yup.number().required(),
    //         selling_price: yup.string().required(),
    //         cost_price: yup.string().required(),
    //         tax: yup.string().required(),
    //         description: yup.string().required(),
    //     })
    //   ).required(),
    manufacturer_name: yup.string().required("Please enter Manufacturer Name."),
    purchase_date: yup.string().required("Please enter Purchase Date."),
    bill_no: yup.string().required("Please enter Bill Number"),
    gst_no: yup.string().required("Please enter GST Number."),
    mobile_number: yup.string().required("Please enter Mobile Number."),
    address: yup.string().required("Please enter Address."),

});

const tableColumns = [
    {field: 'product_name', header:"Product Name"},
    {field: 'quantity', header:"Quantity"},
    {field: 'selling_price', header:"Selling Price"},
    {field: 'cost_price', header:"Cost Price"},
    {field: 'tax', header:"Tax"},
    {field: 'description', header:"Description"},
]

  const inputFieldsList = [
    {
      fieldTitle:"Manufacturer Name", 
      fieldId:"ManufacturerName",
      fieldName:'manufacturer_name', 
      type:'single_select', 
      options:[], 
      isRequired:true
    },
    {fieldTitle:"Purchase Date", fieldId:"PurchaseDate",fieldName:'purchase_date', isRequired:true},
    {fieldTitle:"Bill No", fieldId:"BillNo",fieldName:'bill_no', isRequired:true},
    {fieldTitle:"GST No", fieldId:"GSTNo",fieldName:'gst_no', isRequired:true},
    {fieldTitle:"Mobile Number", fieldId:"Mobile Number",fieldName:'mobile_number', isRequired:true},
    {fieldTitle:"Address", fieldId:"Address",fieldName:'address', isRequired:true},
  ]
  

const AddPurchase = () => {
    const dispatch = useDispatch();

  const [purchaseTableDialog, setPurchaseTableDialog] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(intialDialogState)
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);

  const { purchaseLoading, purchaseTableData } = useSelector(
    ({ purchase }) => purchase
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState
  });
  
  const onSubmit = async data => {
    console.log("data", data, purchaseTableData);
  };

  const hideDeleteDialog = () => {
    setDeleteItemDialog(false)
  }

  const handleEditItem = async (product) => {
    setPurchaseTableDialog(true)
    setSelectedPurchaseData(product);
  };

  const handleDeleteItem = async (product) => {
    setDeleteItemDialog(true)
    setSelectedPurchaseData(product);
  };

  const actionBodyTemplate = rowData => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={(e) => {
            e.preventDefault();
            handleEditItem(rowData)
        }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteItem(rowData)
        }}
        />
      </div>
    );
  };

  const handleDeleteProduct = () => {
    const updatedPurchaseTableData = purchaseTableData?.filter((item) => item?.unique_id !== selectedPurchaseData?.unique_id)
    dispatch(setPurchaseTableData(updatedPurchaseTableData))
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

  return (
    <>
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="form_container">
          <Row>
            {inputFieldsList.map((field,i) => {
                return(
                  <Col lg={3} key={i}>
                    <CommonInputText
                      type={field?.type}
                      id={field?.fieldId}
                      name={field?.fieldName}
                      body={field?.fieldBody}
                      options={field?.options}
                      title={field?.fieldTitle}
                      isRequired={field?.isRequired}
                    />
                  </Col>
                )
            })}
          </Row>
        </div>
        <div className="m-5 d-flex justify-end">
          <Button
            className="btn_primary"
            onClick={e => {
              e.preventDefault();
              setPurchaseTableDialog(true);
              setSelectedPurchaseData(intialDialogState);
            }}
          >
            + Add
          </Button>
        </div>
        <div>
          <div className="table_wrapper">
            <DataTable
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
                    )
                })}
              <Column
                header="Action"
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              />
            </DataTable>
          </div>
        </div>

        <div className="me-10 flex justify-end items-center gap-3">
          <Button
            className="btn_transperent"
            onClick={e => {
              e.preventDefault();
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
    <PurchaseTableDialog
        purchaseTableDialog={purchaseTableDialog}
        selectedPurchaseData={selectedPurchaseData}
        setPurchaseTableDialog={setPurchaseTableDialog}
    />
    <CommonDeleteConfirmation
        open={deleteItemDialog} 
        hideContent={hideDeleteDialog} 
        footerContent={deleteProductDialogFooter} 
      />
    </>
  );
}

export default memo(AddPurchase);
