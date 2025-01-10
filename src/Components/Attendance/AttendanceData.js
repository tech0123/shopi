"use client";
import * as yup from "yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import Loader from "@/helper/CommonComponent/Loader";
import _ from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import {
  addItem,
  getAllDataList,
  getSingleItem,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import {
  checkINOutData,
  getList,
  setAllAttendanceList,
  setSelectedAttendanceData,
  setAttendanceDialog,
  getSingleData,
} from "@/store/slice/attendanceSlice";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import Image from "next/image";
import CommonInputSingalSelect from "@/helper/CommonComponent/CommonInputSingalSelect";
import {
  setAllEmployeeList,
  setDeleteEmployeeDialog,
  setEmployeeDialog,
  setSelectedEmployeeData,
} from "@/store/slice/employeeSlice";
import {
  attendance_search_key,
  employee_search_key,
} from "@/helper/commonValues";
import { Calendar } from "primereact/calendar";
import { seFormContext } from "react-hook-form";
import { useParams } from "next/navigation";

const initialState = {
  check_in: "",
  check_out: "",
  name: "",
  employee_id: "",
};

const schema = yup.object().shape({
  check_in: yup.string().required("Please enter Check In Time."),
  check_out: yup.string().required("Please enter Check Out Time."),
});

const inputFieldsList = [
  {
    fieldTitle: "Check In Time",
    fieldId: "Check In Time",
    fieldName: "check_in",
    fieldRequired: true,
    fieldType: "time",
  },
  {
    fieldTitle: "Check Out Time",
    fieldId: "Check Out Time",
    fieldName: "check_out",
    fieldRequired: true,
    fieldType: "time",
  },
];

const Attendance = () => {
  const dispatch = useDispatch();

  const {
    attendanceLoading,
    allAttendanceList,
    attendanceDialog,
    selectedAttendanceData,
  } = useSelector(({ attendance }) => attendance);
  const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(
    ({ common }) => common
  );
  // const { employeeLoading, allEmployeeList, selectedEmployeeData, employeeDialog, deleteEmployeeDialog } = useSelector(({ employee }) => employee);

  const { date } = useParams();

  const fetchAttendanceList = useCallback(
    async (start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: "Attendance",
        search_key: attendance_search_key,
        start: start,
        limit: limit,
        search: search?.trim(),
        date,
      };
      // const attendance_payload = { modal_to_pass: "Attendance", search_key: attendance_search_key }
      const res = await dispatch(getAllDataList(payload));
      // const res_attendance = await dispatch(getAllDataList(attendance_payload))

      // dispatch(setAllEmployeeList(res?.payload?.list))
      // dispatch(setAllAttendanceList(res2))
    },
    [dispatch]
  );

  useEffect(() => {
    fetchAttendanceList();
  }, []);

  const checkInTemplete = (rowData) => {
    return (
      <p>
        {new Date(
          rowData?.attendance_by_date?.[date]?.check_in
        )?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) || ""}
      </p>
    );
  };

  const checkOutTemplete = (rowData) => {
    return (
      <p>
        {new Date(
          rowData?.attendance_by_date?.[date]?.check_out
        )?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) || ""}
      </p>
    );
  };

  const tableColumns = [
    { field: "name", header: "Name" },
    { field: "check_in", header: "Check In", body: checkInTemplete },
    { field: "check_out", header: "Check Out", body: checkOutTemplete },
  ];

  const onPageChange = (page) => {
    if (page !== currentPage) {
      let pageIndex = currentPage;
      if (page?.page === "Prev") pageIndex--;
      else if (page?.page === "Next") pageIndex++;
      else pageIndex = page;

      dispatch(setCurrentPage(pageIndex));
      fetchAttendanceList(pageIndex, pageLimit, searchParam);
    }
  };

  const onPageRowsChange = (page) => {
    dispatch(setCurrentPage(page === 0 ? 0 : 1));
    dispatch(setPageLimit(page));
    const pageValue =
      page === 0
        ? allAttendanceList?.totalRows
          ? allAttendanceList?.totalRows
          : 0
        : page;
    const prevPageValue =
      pageLimit === 0
        ? allAttendanceList?.totalRows
          ? allAttendanceList?.totalRows
          : 0
        : pageLimit;
    if (
      prevPageValue < allAttendanceList?.totalRows ||
      pageValue < allAttendanceList?.totalRows
    ) {
      fetchAttendanceList(page === 0 ? 0 : 1, page, searchParam);
    }
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedAttendanceData,
  });

  const { getValues, control, setValue } = methods;
  const { check_status } = getValues();

  const onSubmit = async (data) => {
    let res = "";
    const dateFormat = new Date(date);
    const dateKey = dateFormat?.toISOString().split("T")[0];

    // const cin = new Date(data?.check_in)
    // const cout = new Date(data?.check_out);

    // const check_in = data?.check_in
    // const check_out = data?.check_out
    const payload = {
      employee_id: data?.employee_id,
      name: data?.name || "",
      check_in: data?.check_in,
      check_out: data?.check_out,
      date: dateKey,
    };

    if (data?._id) {
      res = await dispatch(checkINOutData(payload));
    }
    //  else {
    // res = await dispatch(addItem(payload));
    // }

    if (res?.payload) {
      // dispatch(setAllAttendanceList(res));
      dispatch(setAttendanceDialog(false));
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

  // const handleAddItem = () => {
  //     dispatch(setSelectedAttendanceData(initialState));
  //     methods.reset(initialState);
  //     dispatch(setAttendanceDialog(true))
  // };

  const handleEditItem = async (attendance) => {
    dispatch(setAttendanceDialog(true));
    console.log("attendance", attendance);
    const payload = { id: attendance };
    const res = await dispatch(getSingleData(payload));
    const dateFormat = new Date(date);
    const dateKey = dateFormat?.toISOString().split("T")[0];
    console.log("res", res);
    const in_time = new Date(
      res?.payload?.attendance_by_date[dateKey]?.check_in
    );
    const out_time = new Date(
      res?.payload?.attendance_by_date[dateKey]?.check_out
    );

    if (res?.payload) {
      // dispatch(setSelectedAttendanceData({ check_in: check_in_time, check_out: check_out_time }));
      methods.reset({
        _id: res?.payload?._id,
        check_in: in_time,
        check_out: out_time,
        employee_id: res?.payload?.employee_id,
        name: res?.payload?.name,
      });
    }
  };

  const actionBodyResponsiveTemplate = (rowData) => {
    return (
      <div className="flex flex-col items-start">
        <p
          className="cursor-pointer text-sm"
          onClick={() => handleEditItem(rowData)}
        >
          Edit
        </p>
      </div>
    );
  };

  const responsiveTableTemplete = (rowData) => {
    return (
      <div className="container flex flex-col border-white border-2 w-full">
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex-1 border-r-2 border-white p-2">
            <p className="text-left text-sm">Name: {rowData?.name}</p>
            <p className="text-left text-sm">
              Check In:{" "}
              {new Date(
                rowData?.attendance_by_date?.[date]?.check_in
              )?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-left text-sm">
              Check Out:{" "}
              {new Date(
                rowData?.attendance_by_date?.[date]?.check_out
              )?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>

            <div className="text-left mt-1">
              {actionBodyResponsiveTemplate(rowData)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  console.log("allAttendanceList", allAttendanceList);
  return (
    <>
      {commonLoading && <Loader />}
      <CommonDataTable
        tableName="Attendance"
        moduleName="attendance"
        tableColumns={tableColumns}
        allItemList={allAttendanceList}
        handleChangeSearch={handleChangeSearch}
        searchParam={searchParam}
        handleEditItem={handleEditItem}
        responsiveTableTemplete={responsiveTableTemplete}
        isDisable={false}
        pageLimit={pageLimit}
        onPageChange={onPageChange}
        onPageRowsChange={onPageRowsChange}
        currentPage={currentPage}
      />

      <Dialog
        visible={attendanceDialog}
        style={{ width: "55rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`${methods.watch("_id") ? "Edit" : "Add"} Attendance`}
        modal
        className="p-fluid "
        onHide={() => dispatch(setAttendanceDialog(false))}
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
                        type={field.fieldType}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="mt-3 me-2 flex justify-content-end items-center gap-4">
              <Button
                className="btn_transparent"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setAttendanceDialog(false));
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
export default memo(Attendance);
