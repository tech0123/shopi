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
import { addItem, getAllDataList, updateItem } from "@/store/slice/commonSlice";
import CommonDeleteConfirmation from "@/helper/CommonComponent/CommonDeleteConfirmation";
import { setAllPurchaseListData, setPurchaseTableData } from "@/store/slice/purchaseSlice";
import { calculateTotal, default_search_key, convertIntoNumber, getFormattedDate } from "@/helper/commonValues";

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
  mobile_number: yup.string().required("Please enter Mobile Number."),
  address: yup.string().required("Please enter Address."),
});

const tableColumns = [
  { field: 'product_name', header: "Product Name" },
  { field: 'quantity', header: "Quantity" },
  { field: 'selling_price', header: "Selling Price" },
  { field: 'cost_price', header: "Cost Price" },
  { field: 'tax', header: "Tax" },
  { field: 'description', header: "Description" },
]

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
  { fieldTitle: "Purchase Date", fieldId: "PurchaseDate", fieldName: 'purchase_date', type: 'date', isRequired: true },
  { fieldTitle: "Bill No", fieldId: "BillNo", fieldName: 'bill_no', isRequired: true },
  { fieldTitle: "GST No", fieldId: "GSTNo", fieldName: 'gst_no', isRequired: true },
  { fieldTitle: "Mobile Number", fieldId: "Mobile Number", fieldName: 'mobile_number', isRequired: true },
  { fieldTitle: "Address", fieldId: "Address", fieldName: 'address', isRequired: true },
]

const CommonAddEditPurchase = (props) => {
  const { initialValue } = props
  const router = useRouter();
  const dispatch = useDispatch();
  const { purchaseId } = useParams();

  const [purchaseTableDialog, setPurchaseTableDialog] = useState(false);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState(intialDialogState)
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

  const { purchaseTableData } = useSelector(
    ({ purchase }) => purchase
  );
  const { allManufacturerList } = useSelector(({ manufacturer }) => manufacturer)
  const { allProductList } = useSelector(({ productItem }) => productItem)

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValue,
  });

  const values = methods.getValues()

  const handleManufacturerChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value

    const findManufacturerData = allManufacturerList?.list?.find((item) => {
      return item?._id === value
    })
    const fieldsObj = {
      ...findManufacturerData,
      [name]: value
    }
    methods.reset(fieldsObj);
  }

  const manufacturerOptions = useMemo(() => {
    if (allManufacturerList?.list?.length) {
      const data = allManufacturerList?.list?.map(item => ({
        label: item?.name,
        value: item?._id
      }));
      return data;
    }
  }, [allManufacturerList])

  const fetchProductList = useCallback(async (key_name) => {
    const payload = { modal_to_pass: key_name, search_key: default_search_key }
    const res = await dispatch(getAllDataList(payload))
  }, [])

  useEffect(() => {
    fetchProductList("Manufacturers")
    fetchProductList("Products")
  }, []);

  useEffect(() => {
    methods.reset(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (purchaseTableData?.length) {
      const calculated_subTotal = calculateTotal(purchaseTableData, 'cost_price')
      const current_discount = values?.discount ? values?.discount : 0
      const current_tax = values?.tax ? values?.tax : 0
      const calculated_tax = ((calculated_subTotal - current_discount) * current_tax) / 100
      const calculated_total_amount = calculated_subTotal - current_discount - calculated_tax

      const obj = {
        sub_total: convertIntoNumber(calculated_subTotal),
        total_amount: convertIntoNumber(calculated_total_amount),
        purchase_record_table: purchaseTableData,
      }
      methods.reset((prev) => ({ ...prev, ...obj }))
    }
  }, [purchaseTableData])

  const onSubmit = async data => {
    let res = '';

    const updatedPurchaseItemsTableData = data?.purchase_record_table?.map((item) => {
      const { unique_id, ...rest } = item;
      return rest
    })
    const findManufacturerObj = manufacturerOptions?.find((item) => item?.value === data?.manufacturer)

    let payload = {
      ...data,
      modal_to_pass: "purchase",
      search_key: default_search_key,
      manufacturer_name: findManufacturerObj?.label,
      purchase_record_table: updatedPurchaseItemsTableData,
      purchase_date: getFormattedDate(data?.purchase_date),
    }

    if (purchaseId) {
      res = await dispatch(updateItem(payload));
    } else {
      res = await dispatch(addItem(payload));
    }

    if (res?.payload) {
      dispatch(setAllPurchaseListData(res));
      router.push('/purchase');
    }
  };

  const hideDeleteDialog = () => {
    setDeleteItemDialog(false)
  }

  const handleAddPurchaseItem = () => {
    setPurchaseTableDialog(true);
    setSelectedPurchaseData(intialDialogState);

    const filteredProductOptions = allProductList?.list?.map((item) => {
      const filteredProductData = purchaseTableData.every((data) => { return data?.product !== item?._id && item })

      if (!purchaseTableData?.length || filteredProductData) {
        return {
          label: item?.name,
          value: item?._id
        }
      }
    }).filter((item) => item)

    setProductOptions(filteredProductOptions)
  }

  const handleEditItem = async (product) => {
    fetchProductList("Products")
    setPurchaseTableDialog(true)
    setSelectedPurchaseData(product);
  };

  const handleDeleteItem = async (product) => {
    setDeleteItemDialog(true)
    setSelectedPurchaseData(product);
  };

  const actionBodyTemplate = rowData => {
    return (
      <>
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
      </>
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
      <div className="m-5 text-xl text-slate-300">{purchaseId ? "Edit" : "Add"} Purchase Item</div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form_container">
            <Row>
              <Col lg={3}>
                <CommonInputText
                  type='single_select'
                  title="Manufacturer"
                  id="Manufacturer"
                  name='manufacturer'
                  options={manufacturerOptions}
                  isRequired={true}
                  fieldOnChange={(e) => {
                    handleManufacturerChange(e)
                  }}
                />
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
                )
              })}
            </Row>
          </div>
          <div className="me-20 mt-5 mb-3 d-flex justify-end">
            <Button
              className="btn_primary"
              onClick={e => {
                e.preventDefault();
                handleAddPurchaseItem()
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
                            type='number'
                            id='Discount'
                            name='discount'
                            className="mb-0"
                            placeholder='Discount'
                            disabled={!purchaseTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(purchaseTableData, 'cost_price')
                              const current_discount = e?.value ? e?.value : 0
                              const current_tax = values?.tax ? values?.tax : 0
                              const calculated_tax = ((calculated_subTotal - current_discount) * (current_tax)) / 100

                              const calculated_total_amount = calculated_subTotal - current_discount - calculated_tax

                              const obj = {
                                sub_total: convertIntoNumber(calculated_subTotal),
                                total_amount: convertIntoNumber(calculated_total_amount),
                                purchase_record_table: purchaseTableData,
                              }

                              methods.reset((prev) => ({ ...prev, ...obj }))
                              methods.setValue('discount', current_discount, { shouldValidate: true })
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
                            id='Tax'
                            name='tax'
                            type='number'
                            placeholder='Tax'
                            className="mb-0"
                            disabled={!purchaseTableData?.length}
                            fieldOnChange={(e) => {
                              const calculated_subTotal = calculateTotal(purchaseTableData, 'cost_price')
                              const current_discount = values?.discount ? values?.discount : 0
                              const current_tax = e?.value ? e?.value : 0
                              const calculated_tax = ((calculated_subTotal - current_discount) * current_tax) / 100
                              const calculated_total_amount = calculated_subTotal - current_discount - calculated_tax

                              const obj = {
                                purchase_record_table: purchaseTableData,
                                sub_total: convertIntoNumber(calculated_subTotal),
                                total_amount: convertIntoNumber(calculated_total_amount),
                              }

                              methods.reset((prev) => ({ ...prev, ...obj }))
                              methods.setValue('tax', current_tax, { shouldValidate: true })
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
              onClick={e => {
                e.preventDefault();
                router.push('/purchase');
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
        productOptions={productOptions}
        purchaseTableDialog={purchaseTableDialog}
        selectedPurchaseData={selectedPurchaseData}
        setPurchaseTableDialog={setPurchaseTableDialog}
        setTableValue={methods}
      />
      <CommonDeleteConfirmation
        open={deleteItemDialog}
        hideContent={hideDeleteDialog}
        footerContent={deleteProductDialogFooter}
      />
    </>
  );
}

export default memo(CommonAddEditPurchase);