import React, { useEffect } from "react";
import * as yup from "yup";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { calculateTotal, generateUniqueId } from "@/helper/commonValues";
import { setPurchaseTableData } from "@/store/slice/purchaseSlice";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";

const schema = yup.object().shape({
    product: yup.string().required("Please enter Product Name."),
    description: yup.string().required("Please enter Description."),
    quantity: yup.string().required("Please enter Quantity."),
    tax: yup.string().required("Please enter Tax."),
    selling_price: yup.string().required("Please enter Selling Price."),
    cost_price: yup.string().required("Please enter Cost Price.")
});

const inputFieldsList = [
  // {
  //   fieldTitle: "Product",
  //   fieldId: "Product",
  //   fieldName: "product",
  //   type:'single_select', 
  //   options: productsOptions, 
  //   isequired: true
  // },
  {
    fieldTitle: "Quantity",
    fieldId: "Quantity",
    fieldName: "quantity",
    isequired: true
  },
  {
    fieldTitle: "Selling Price",
    fieldId: "SellingPrice",
    fieldName: "selling_price",
    isequired: true
  },
  {
    fieldTitle: "Cost Price",
    fieldId: "CostPrice",
    fieldName: "cost_price",
    isequired: true
  },
  { fieldTitle: "Tax", fieldId: "Tax", fieldName: "tax", isequired: true },
  {
    fieldTitle: "Description",
    fieldId: "Description",
    fieldName: "description",
    isequired: true
  }
];

const PurchaseTableDialog = props => {
  const dispatch = useDispatch();
  const { productOptions, purchaseTableDialog, selectedPurchaseData, setPurchaseTableDialog } = props;
  
  const { purchaseTableData } = useSelector(
    ({ purchase }) => purchase
  );
  const { allProductList } = useSelector(({ productItem }) => productItem)

  // const productsOptions = useMemo(() => {
  //   if(allProductList?.list?.length){
  //     const data = allProductList?.list?.map(item => ({
  //       label: item?.name,
  //       value: item?._id
  //     }));
  //     return data;
  //   }
  // },[allProductList]) 
  
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedPurchaseData
  });

  useEffect(() => {
    if(selectedPurchaseData){
        methods.reset(selectedPurchaseData)
    }
  },[selectedPurchaseData])

  const handleProuctChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value

    const findProductData = allProductList?.list?.find((item) => {
      return item?._id === value
    })  
    const fieldsObj = {
      ...findProductData,
      [name]: value,
      selling_price: ""
    }
    
    methods.reset(fieldsObj);
  }

  const onSubmit = data => {
    let storePurchaseTableData = [...purchaseTableData]
    const productOptionData = productOptions?.find((item) => item?.value === data?.product)
    
    if(data?.unique_id) {
        let purchaseData = [...purchaseTableData]
        const index = purchaseData?.findIndex((index) => index?.unique_id === data?.unique_id)

        if(index !== -1) {
            const oldObj = purchaseData[index]
            const newObj = {
                ...oldObj,
                ...data,
                product_name: productOptionData?.label
            }
            purchaseData[index] = newObj
        }
      
        storePurchaseTableData = purchaseData
    } else {   
        const updatedObj = {
            ...data,
            unique_id: generateUniqueId(),
            product_name: productOptionData?.label,
        }
        
        storePurchaseTableData = [...purchaseTableData, updatedObj]
      }

      dispatch(setPurchaseTableData(storePurchaseTableData))
      setPurchaseTableDialog(false)
  };

  return (
    <Dialog
      visible={purchaseTableDialog}
      style={{ width: "55rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={`${methods.watch("unique_id") ? "Edit" : "Add"} Purchase Item`}
      modal
      className="p-fluid"
      onHide={() => setPurchaseTableDialog(false)}
      draggable={false}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form_container">
            <Row>
              <Col lg={6}>
                <CommonInputText
                  type='single_select'
                  title="Product" 
                  id="Product"
                  name='product' 
                  options={productOptions} 
                  isRequired={true}
                  fieldOnChange={(e) => {
                    handleProuctChange(e)
                  }}
                />
              </Col>

              {inputFieldsList.map((field, i) => {
                return (
                  <Col lg={6} key={i}>
                    <CommonInputText
                      id={field?.fieldId}
                      title={field?.fieldTitle}
                      body={field?.fieldBody}
                      name={field?.fieldName}
                      type={field?.type}
                      options={field?.options}
                      isRequired={field?.isequired}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
          <div className="mt-3 me-2 flex justify-end items-center gap-4">
            <Button
              className="btn_transparent"
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
