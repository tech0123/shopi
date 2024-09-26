'use client'
import React, { memo, useCallback, useEffect } from "react";
import * as yup from "yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import Loader from "@/helper/CommonComponent/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { 
    setManufacturerDialog, 
    setAllManufacturerList, 
    setDeleteManufacturerDialog, 
    setSelectedManufacturerData,
} from "@/store/slice/manufacturerSlice";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { addItem, deleteItem, getAllDataList, getSingleItem, updateItem } from "@/store/slice/commonSlice";

const initialState = {
    code: "",
    name: "",
    email_address: "",
    mobile_number: "",
    gst_no: "",
    country: "",
    state: "",
    city: "",
    pin_code: "",
    address: "",
  };

const schema = yup.object().shape({
    code: yup.string().required("Please enter Code."),
    name: yup.string().required("Please enter Full Name."),
    email_address: yup.string().required("Please enter Email Address."),
    mobile_number: yup.string().required("Please enter Mobile Number."),
    gst_no: yup.string().required("Please enter Cost GST No."),
    country: yup.string().required("Please enter Country."),
    state: yup.string().required("Please enter State."),
    city: yup.string().required("Please enter City."),
    pin_code: yup.string().required("Please enter Pin Code."),
    address: yup.string().required("Please enter Address."),
});

const imageBodyTemplate = rowData => {
    return (
      <p>Dhruvit</p>
    );
  };

const tableColumns = [
    {field: 'code', header:"Code"},
    {field: 'name', header:"Name"},
    {field: 'email_address', header:"Email"},
    {field: 'mobile_number', header:"Mobile Number"},
    {field: 'gst_no', header:"GST No."},
    {field: 'country', header:"Country"},
    {field: 'state', header:"State"},
    {field: 'city', header:"City"},
    {field: 'address', header:"Address"},
]

const inputFieldsList = [
    {fieldTitle:"Code", fieldId:"Code",fieldName:'code', fieldRequired:true},
    {fieldTitle:"Full Name", fieldId:"FullName",fieldName:'name', fieldRequired:true},
    {fieldTitle:"Email Address", fieldId:"EmailAddress",fieldName:'email_address', fieldRequired:true},
    {fieldTitle:"Mobile Number", fieldId:"MobileNumber",fieldName:'mobile_number', fieldRequired:true},
    {fieldTitle:"GST No.", fieldId:"GSTNo",fieldName:'gst_no', fieldRequired:true},
    {fieldTitle:"Country", fieldId:"Country",fieldName:'country', fieldRequired:true},
    {fieldTitle:"State", fieldId:"State",fieldName:'state', fieldRequired:true},
    {fieldTitle:"City", fieldId:"City",fieldName:'city', fieldRequired:true},
    {fieldTitle:"Pin code", fieldId:"PinCode",fieldName:'pin_code', fieldRequired:true},
    {fieldTitle:"Address", fieldId:"Address",fieldName:'address', fieldRequired:true},
]

const ManufacturerList = () => {
    const dispatch = useDispatch();

    const { 
        allManufacturerList, 
        manufacturerDialog, 
        selectedManufacturerData, 
        deleteManufacturerDialog 
    } = useSelector(({ manufacturer }) => manufacturer)
    const {commonLoading } = useSelector(({common}) => common)

    const fetchManufacturerList = useCallback(async () => {
      const payload = { modal_to_pass: "Manufacturers" }
      const res = await dispatch(getAllDataList(payload))
      if(res){
        dispatch(setAllManufacturerList(res))
      }
    },[])
    
    useEffect(() => {
        fetchManufacturerList()
    }, []);
  
    const methods = useForm({
      resolver: yupResolver(schema),
      defaultValues: selectedManufacturerData
    });

    const onSubmit = async (data) => {
        let res='';
        const payload = { 
          ...data,
          modal_to_pass:"manufacturer"
        }
    
        if(data?._id){
          res = await dispatch(updateItem(payload))
        } else {
          res = await dispatch(addItem(payload))
        }
        
        if(res){
          dispatch(setAllManufacturerList(res))
          dispatch(setManufacturerDialog(false))
        }
    };

      const handleAddItem = () => {
        dispatch(setSelectedManufacturerData(initialState));
        methods.reset(initialState);
        dispatch(setManufacturerDialog(true))
      };
    
      const handleEditItem = async (item) => {
        dispatch(setManufacturerDialog(true))
        const payload = {modal_to_pass:"manufacturer", id: item?._id}
        const res = await dispatch(getSingleItem(payload))
        
        if(res){
          dispatch(setSelectedManufacturerData(res));
          methods.reset(res);
        }
      };
    
      const handleDeleteItem = item => {
        dispatch(setSelectedManufacturerData(item));
        methods.reset(item);
        dispatch(setDeleteManufacturerDialog(true));
      };

      const handleDeleteManufacturer = async () => {
        const payload = { modal_to_pass: 'manufacturer', id: selectedManufacturerData?._id };
        const res = await dispatch(deleteItem(payload))
        if(res){
          dispatch(setAllManufacturerList(res))
          dispatch(setDeleteManufacturerDialog(false));
        }
      };

      const hideManufacturerDeleteDialog = () => {
        dispatch(setDeleteManufacturerDialog(false));
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
                <img
                    src={`${rowData.image}`}
                    alt=""
                    width={150}
                    height={150}
                />
            </div>
            <div className="flex flex-1 flex-col md:flex-row">
                <div className="flex-1 border-r-2 border-white p-2">
                    <p className="text-left text-sm">
                        Code: {rowData.code}
                    </p>
                    <p className="text-left text-sm">
                        Full Name: {rowData.name}
                    </p>
                    <p className="text-left text-sm">
                        Email Address: {rowData.email_address}
                    </p>
                    <p className="text-left text-sm">
                        Phone Number: {rowData.mobile_number}
                    </p>
                </div>
                <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
                    <p className="text-left text-sm">
                        GST No.: {rowData.gst_no}
                    </p>
                    <p className="text-left text-sm">
                        Country: {rowData.country}
                    </p>
                    <p className="text-left text-sm">
                        State: {rowData.state}
                    </p>
                    <p className="text-left text-sm">
                        City: {rowData.pin_codeity}
                    </p>
                </div>
                <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
                    <p className="text-left text-sm">
                        Pin code: {rowData.pin_code}
                    </p>
                    <p className="text-left text-sm">
                        Address: {rowData.address}
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
      <CommonDataTable
        tableName="Manufacturers"
        tableColumns={tableColumns}
        allItemList={allManufacturerList}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deleteManufacturerDialog}
        hideDeleteDialog={hideManufacturerDeleteDialog}
        deleteItem={handleDeleteManufacturer}
      />

    <Dialog
        visible={manufacturerDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch('_id') ? 'Edit' : "Add"} Manufacturer`}
        modal
        className="p-fluid"
        onHide={() => dispatch(setManufacturerDialog(false))}
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
                className="btn_transparent"
                onClick={e => {
                  e.preventDefault();
                  dispatch(setManufacturerDialog(false))
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

export default memo(ManufacturerList);
