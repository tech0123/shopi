"use client";
import React, { useEffect } from "react";
import * as yup from "yup";
import {
  setAllEmployeeList,
  setDeleteEmployeeDialog,
  setEmployeeDialog,
  setSelectedEmployeeData
} from "@/store/slice/employeeSlice";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import { addItem, deleteItem, getAllDataList, getSingleItem, updateItem } from "@/store/slice/commonSlice";
import Loader from "@/helper/CommonComponent/Loader";
import { setDeleteProductDialog } from "@/store/slice/productItemSlice";

const getSeverity = employee => {
  switch (employee.status) {
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

const employeeRoleOptions = [
  { label: "Owner", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Sales-Men", value: 3 },
  { label: "C.A.", value: 4 }
]

const initialState = {
  name: "",
  email: '',
  mobile_number: "",
  role: '',
  salary: 0,
}

const schema = yup.object().shape({
  name: yup.string().required("Please enter Name."),
  email: yup.string().email().required("Please enter Email."),
  mobile_number: yup.string().required("Please enter Mobile Number."),
  role: yup.string().required("Please enter Role."),
  password: yup.string().required("Please enter valid Password."),
  salary: yup.string().required("Please enter Salary.")
});


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
  { field: "image", header: "Image", body: { imageBodyTemplate } },
  { field: "name", header: "Name" },
  { field: "email", header: "Email" },
  { field: "mobile_number", header: "Mobile Number" },
  { field: "role", header: "Role" },
  { field: "salary", header: "Salary" }
];

const inputFieldsList = [
  {fieldTitle:"Name", fieldId:"Name", fieldName:'name', fieldRequired:true},
  {fieldTitle:"Email", fieldId:"Email",fieldName:'email', fieldRequired:true},
  {fieldTitle:"Mobile Number", fieldId:"MobileNumber",fieldName:'mobile_number', fieldRequired:true},
  {fieldTitle:"Role", fieldId:"Role",fieldName:'role', type:'single_select', options: employeeRoleOptions, fieldRequired:true},
  {fieldTitle:"Password", fieldId:"Password",fieldName:'password', fieldRequired:true},
  {fieldTitle:"Salary", fieldId:"Salary",fieldName:'salary', type:'number', fieldRequired:true, class:"input_number"},
]

const EmployeeList = () => {
  const dispatch = useDispatch();

  // const [selectedEmployeeData, setSelectedEmployeeData] = useState(initialState);
  // const [globalFilter, setGlobalFilter] = useState(null);
  // const [employeeDialog, setEmployeeDialog] = useState(false);
  // const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  const { employeeLoading, allEmployeeList, selectedEmployeeData, employeeDialog, deleteEmployeeDialog } = useSelector(({ employee }) => employee);
  const {commonLoading } = useSelector(({common}) => common)
  
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedEmployeeData
  });
  
  const fetchEmployeesData = async () => {
    const payload = { modal_to_pass: "Employees" };
    const res = await dispatch(getAllDataList(payload));

    if (res) {
      const updatedData = res?.map((item) => {
      const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
      return {
        ...item,
        role: findRole?.label
      }
    })
      dispatch(setAllEmployeeList(updatedData));
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const onSubmit = async (data) => {
    let res='';
    const payload = { 
      ...data,
      role: Number(data.role),
      modal_to_pass: "employee"
    }

    if(data?._id){
      res = await dispatch(updateItem(payload))
    } else {
      res = await dispatch(addItem(payload))
    }
    if(res){
      const updatedData = res?.map((item) => {
        const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
        return {
          ...item,
          role: findRole?.label
        }
      })
      dispatch(setAllEmployeeList(updatedData))
      dispatch(setEmployeeDialog(false))
    }
  };

  const handleAddItem = () => {
    dispatch(setSelectedEmployeeData(initialState));
    methods.reset(initialState);
    dispatch(setEmployeeDialog(true));
  };

  const handleEditItem = async (employee) => {
    const payload = { modal_to_pass:"employee", id: employee?._id }

    dispatch(setEmployeeDialog(true));
    const res = await dispatch(getSingleItem(payload))
    
    if(res){
      dispatch(setSelectedEmployeeData(res));
      methods.reset(res);
    }
  };

  const handleDeleteItem = employee => {
    dispatch(setSelectedEmployeeData(employee));
    methods.reset(employee);
    dispatch(setDeleteEmployeeDialog(true));
  };

  const hideProductDeleteDialog = () => {
    dispatch(setDeleteEmployeeDialog(false));
  };

  const handleDeleteProduct = async () => {
    const payload = { modal_to_pass: 'employee', id: selectedEmployeeData?._id };
    const res = await dispatch(deleteItem(payload))
    if(res){
      const updatedData = res?.map((item) => {
        const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
        return {
          ...item,
          role: findRole?.label
        }
      })
      dispatch(setAllEmployeeList(updatedData))
      dispatch(setDeleteEmployeeDialog(false));
    }
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
            src={`/${rowData?.image}`}
            alt="image"
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex-1 border-r-2 border-white p-2">
            <p className="text-left text-sm">
              Name: {rowData?.name}
            </p>
            <p className="text-left text-sm">
              Email: {rowData?.email}
            </p>
            <p className="text-left text-sm">
              Mobile Number: {rowData?.mobile_number}
            </p>
          </div>
          <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
            <p className="text-left text-sm">
              Role: {rowData?.role}
            </p>
            <p className="text-left text-sm">
              Salary: {rowData?.salary}
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
    {employeeLoading || commonLoading && <Loader/>}
    <CommonDataTable
      tableName="Employees"
      moduleName='employee' 
      tableColumns={tableColumns}
      allItemList={allEmployeeList}
      handleAddItem={handleAddItem}
      handleEditItem={handleEditItem}
      handleDeleteItem={handleDeleteItem}
      responsiveTableTemplete={responsiveTableTemplete}
      deleteItemDialog={deleteEmployeeDialog}
      // setDeleteItemDialog='setDeleteProductDialog'
      // setAllItemList='setAllEmployeeList'
      hideDeleteDialog={hideProductDeleteDialog}
      deleteItem={handleDeleteProduct}
      selectedItemData={selectedEmployeeData}
      // selectedItemName={selectedEmployeeData?.name}
    />

    <Dialog
      visible={employeeDialog}
      style={{ width: "55rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={`${methods.watch('_id') ? 'Edit' : "Add"} Employee`}
      modal
      className="p-fluid"
      onHide={() => dispatch(setEmployeeDialog(false))}
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
                  type={field.type}
                  options={field.options}
                  name={field.fieldName}
                  isRequired={field.fieldRequired}
                  className={field.class}
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
              dispatch(setEmployeeDialog(false))
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
}
export default EmployeeList;