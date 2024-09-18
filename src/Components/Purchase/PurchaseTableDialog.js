import React, { useEffect } from "react";
import * as yup from "yup";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { setPurchaseTableData } from "@/store/slice/purchaseSlice";
import { generateUniqueId } from "@/helper/commonValues";

const schema = yup.object().shape({
    product_name: yup.string().required("Please enter Product Name."),
    description: yup.string().required("Please enter Description."),
    quantity: yup.string().required("Please enter Quantity."),
    tax: yup.string().required("Please enter Tax."),
    selling_price: yup.string().required("Please enter Selling Price."),
    cost_price: yup.string().required("Please enter Cost Price.")
});

const inputFieldsList = [
  {
    fieldTitle: "Product Name",
    fieldId: "ProductName",
    fieldName: "product_name",
    fieldRequired: true
  },
  {
    fieldTitle: "Quantity",
    fieldId: "Quantity",
    fieldName: "quantity",
    fieldRequired: true
  },
  {
    fieldTitle: "Selling Price",
    fieldId: "SellingPrice",
    fieldName: "selling_price",
    fieldRequired: true
  },
  {
    fieldTitle: "Cost Price",
    fieldId: "CostPrice",
    fieldName: "cost_price",
    fieldRequired: true
  },
  { fieldTitle: "Tax", fieldId: "Tax", fieldName: "tax", fieldRequired: true },
  {
    fieldTitle: "Description",
    fieldId: "Description",
    fieldName: "description",
    fieldRequired: true
  }
];

const PurchaseTableDialog = props => {
  const dispatch = useDispatch();
  const { purchaseTableDialog, selectedPurchaseData, setPurchaseTableDialog } = props;

  const { purchaseTableData } = useSelector(
    ({ purchase }) => purchase
  );
  
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedPurchaseData
  });

  useEffect(() => {
    if(selectedPurchaseData){
        methods.reset(selectedPurchaseData)
    }
  },[selectedPurchaseData])

  const onSubmit = data => {
    if(data?.unique_id) {
        let purchaseData = [...purchaseTableData]
        const index = purchaseData?.findIndex((index) => index?.unique_id === data?.unique_id)

        if(index !== -1) {
            const oldObj = purchaseData[index]
            const newObj = {
                ...oldObj,
                ...data
            }
            purchaseData[index] = newObj
        }
        
        dispatch(setPurchaseTableData(purchaseData))
    } else {   
        const updatedObj = {
            ...data,
            unique_id: generateUniqueId()
        }
        
        const updatedPurchaseTableData = [...purchaseTableData, updatedObj]
        dispatch(setPurchaseTableData(updatedPurchaseTableData))
    }
    setPurchaseTableDialog(false)
  };

  return (
    <Dialog
      visible={purchaseTableDialog}
      style={{ width: "55rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={`${methods.watch("unique_id") ? "Edit" : "Add"} Product`}
      modal
      className="p-fluid"
      onHide={() => setPurchaseTableDialog(false)}
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
                      body={field?.fieldBody}
                      name={field.fieldName}
                      isRequired={field.fieldRequired}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
          <div className="mt-3 me-2 flex justify-end items-center gap-4">
            <Button
              className="btn_transperent"
              onClick={e => {
                e.preventDefault();
                setPurchaseTableDialog(false);
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
  );
};

export default PurchaseTableDialog;
