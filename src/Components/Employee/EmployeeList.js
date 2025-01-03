"use client";
import React, { useCallback, useEffect } from "react";
import * as yup from "yup";
import {
  setDeleteEmployeeDialog,
  setEmployeeDialog,
  setSelectedEmployeeData,
} from "@/store/slice/employeeSlice";
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
  employee_search_key,
  employeeRoleOptions,
} from "@/helper/commonValues";
import Image from "next/image";

const initialState = {
  image: "",
  name: "",
  email: "",
  mobile_number: "",
  role: "",
  password: "",
  salary: 0,
};

const schema = yup.object().shape({
  name: yup.string().required("Please enter Name."),
  email: yup.string().email().required("Please enter Email."),
  mobile_number: yup.string().required("Please enter Mobile Number."),
  role: yup.string().required("Please enter Role."),
  password: yup.string().required("Please enter valid Password."),
  salary: yup.string().required("Please enter Salary."),
});

const imageBodyTemplate = (rowData) => {
  return (
    // <Image
    //   src={rowData?.image || ''}
    //   alt={rowData?._id || "Image not found"}
    //   className="shadow-2 border-round"
    //   width={150}
    //   height={150}
    //   style={{ objectFit: "cover" }}
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
  { field: "role", header: "Role" },
  { field: "salary", header: "Salary" },
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
    fieldTitle: "Role",
    fieldId: "Role",
    fieldName: "role",
    type: "single_select",
    options: employeeRoleOptions,
    fieldRequired: true,
  },
  {
    fieldTitle: "Password",
    fieldId: "Password",
    fieldName: "password",
    fieldRequired: true,
  },
  {
    fieldTitle: "Salary",
    fieldId: "Salary",
    fieldName: "salary",
    type: "number",
    fieldRequired: true,
    class: "input_number",
  },
  { fieldTitle: "Image", fieldId: "Image", fieldName: "image" },
];

const EmployeeList = () => {
  const dispatch = useDispatch();

  const {
    allEmployeeList,
    selectedEmployeeData,
    employeeDialog,
    deleteEmployeeDialog,
  } = useSelector(({ employee }) => employee);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedEmployeeData,
  });

  const fetchEmployeesData = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Employees",
        search_key: employee_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
      };
      const res = await dispatch(getAllDataList(payload));

      // if (res) {
      // const updatedData = res?.map((item) => {
      //   const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
      //   return {
      //     ...item,
      //     role: findRole?.label
      //   }
      // })
      // dispatch(setAllEmployeeList(updatedData));
      // }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchEmployeesData(currentPage, pageLimit, searchParam);
  }, []);

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchEmployeesData(pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page) => {
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0
        ? allEmployeeList?.totalRows
          ? allEmployeeList?.totalRows
          : 0
        : page;
    const prevPageValue =
      pageLimit === 0
        ? allEmployeeList?.totalRows
          ? allEmployeeList?.totalRows
          : 0
        : pageLimit;
    if (
      prevPageValue < allEmployeeList?.totalRows ||
      pageValue < allEmployeeList?.totalRows
    ) {
      fetchEmployeesData(page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const onSubmit = async (data) => {
    let res = "";
    const payload = {
      ...data,
      role: Number(data.role),
      modal_to_pass: "employee",
      search_key: employee_search_key,
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
      // const updatedData = res?.map((item) => {
      //   const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
      //   return {
      //     ...item,
      //     role: findRole?.label
      //   }
      // })
      // dispatch(setAllEmployeeList(updatedData))
      dispatch(setEmployeeDialog(false));
    }
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchEmployeesData(currentPage, pageLimit, e.target.value?.trim());
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
    dispatch(setSelectedEmployeeData(initialState));
    methods.reset(initialState);
    dispatch(setEmployeeDialog(true));
  };

  const handleEditItem = async (employee) => {
    const payload = { modal_to_pass: "employee", id: employee };

    dispatch(setEmployeeDialog(true));
    const res = await dispatch(getSingleItem(payload));

    if (res?.payload) {
      // dispatch(setSelectedEmployeeData(res));
      methods.reset(res?.payload);
    }
  };

  const handleDeleteItem = (employee) => {
    dispatch(setSelectedEmployeeData(employee));
    methods.reset(employee);
    dispatch(setDeleteEmployeeDialog(true));
  };

  const hideProductDeleteDialog = () => {
    dispatch(setDeleteEmployeeDialog(false));
  };

  const handleDeleteProduct = async () => {
    const payload = {
      modal_to_pass: "employee",
      search_key: employee_search_key,
      id: selectedEmployeeData?._id,
      start: currentPage,
      limit: pageLimit,
      search: searchParam,
    };
    const res = await dispatch(deleteItem(payload));
    if (res?.payload) {
      // const updatedData = res?.map((item) => {
      //   const findRole = employeeRoleOptions?.find((role) => role.value === item.role)
      //   return {
      //     ...item,
      //     role: findRole?.label
      //   }
      // })
      // dispatch(setAllEmployeeList(updatedData))
      dispatch(setDeleteEmployeeDialog(false));
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
        <div className="flex justify-center card-image customers_image">
          <Image
            src={rowData?.image || ""}
            alt={rowData?._id || "Image not found"}
            width={100}
            height={100}
            className="card-img w-100 object-cover object-center h-100 transition duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col flex-md-row responsive-card-partition">
          <div className="flex-1 lg:col-3 responsive-card-details-1">
            <p className="responsive-card-content">
              <span>Name:</span> {rowData?.name}
            </p>
            <p className="responsive-card-content">
              <span>Email:</span> {rowData?.email}
            </p>
            <p className="responsive-card-content">
              <span>Mobile Number:</span> {rowData?.mobile_number}
            </p>
          </div>
          <div className="flex-1 lg:col-3 flex flex-col responsive-card-details-2">
            <p className="responsive-card-content">
              <span>Role:</span> {rowData?.role}
            </p>
            <p className="responsive-card-content">
              <span>Salary:</span> {rowData?.salary}
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
        tableName="Employees"
        moduleName="employee"
        tableColumns={tableColumns}
        allItemList={allEmployeeList}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
        responsiveTableTemplete={responsiveTableTemplete}
        deleteItemDialog={deleteEmployeeDialog}
        hideDeleteDialog={hideProductDeleteDialog}
        deleteItem={handleDeleteProduct}
        // selectedItemData={selectedEmployeeData}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
      />

      <Dialog
        visible={employeeDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch("_id") ? "Edit" : "Add"} Employee`}
        modal
        className="p-fluid common_modal"
        draggable={false}
        onHide={() => dispatch(setEmployeeDialog(false))}
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
            <div className="mt-3 me-2 flex justify-end items-center gap-4 modal__btn__group">
              <Button
                className="btn_transparent"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setEmployeeDialog(false));
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
    </>
  );
};
export default EmployeeList;
