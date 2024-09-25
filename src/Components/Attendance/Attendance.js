'use client';
import * as yup from "yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import Loader from "@/helper/CommonComponent/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { addItem, getAllDataList, getSingleItem, updateItem, deleteItem } from "@/store/slice/commonSlice";
import { checkINOutData, getList, setAllAttendanceList, setSelectedAttendanceData, setAttendanceDialog } from "@/store/slice/attendanceSlice";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import Image from "next/image";
import CommonInputSingalSelect from "@/helper/CommonComponent/CommonInputSingalSelect";
import {
    setAllEmployeeList,
    setDeleteEmployeeDialog,
    setEmployeeDialog,
    setSelectedEmployeeData
} from "@/store/slice/employeeSlice";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


const initialState = {
    check_status: "",
    time: "",
};

const schema = yup.object().shape({
    check_status: yup.string().required("Please enter Check Status."),
    time: yup.string().required("Please enter Description."),
});

const inputFieldsList = [
    // { fieldTitle: "Check In/Out", fieldId: "Check In/Out", fieldName: 'check_status', fieldRequired: true, fieldType: 'single_select' },
    { fieldTitle: "Check In Time", fieldId: "Check In Time", fieldName: 'check_in', fieldRequired: true, fieldType: 'time' },
    { fieldTitle: "Check Out Time", fieldId: "Check Out Time", fieldName: 'check_out', fieldRequired: true, fieldType: 'time' },
]

const Attendance = () => {
    const dispatch = useDispatch();

    const { allAttendanceList, attendanceDialog, selectedAttendanceData } = useSelector(({ attendance }) => attendance)
    const { commonLoading } = useSelector(({ common }) => common)
    const { employeeLoading, allEmployeeList, selectedEmployeeData, employeeDialog, deleteEmployeeDialog } = useSelector(({ employee }) => employee);

    const fetchAttendanceList = useCallback(async () => {
        const payload = { modal_to_pass: "Employees" }
        const payload2 = { modal_to_pass: "Attendance" }
        const res = await dispatch(getAllDataList(payload))
        const res2 = await dispatch(getAllDataList(payload2))

        dispatch(setAllEmployeeList(res))
        // dispatch(setAllAttendanceList(res2))
        console.log('res', res)
        console.log('res2', res2)

    }, [dispatch])

    useEffect(() => {
        fetchAttendanceList()
    }, [fetchAttendanceList]);
    console.log('allAttendanceList', allAttendanceList)

    const clickFunction = (rowData) => {
        const check_in_time = new Date();
        const dateKey = check_in_time.toISOString().split('T')[0];

        const payload = {
            employee_id: rowData?._id,
            name: rowData?.name || '',
            date: dateKey,
            check_in: check_in_time,  // Separate check_in
            check_out: '',  // Separate check_in
        };

        dispatch(checkINOutData(payload));
    };

    const clickOutFunction = (rowData) => {
        const check_out_time = new Date();
        const dateKey = check_out_time.toISOString().split('T')[0];

        const payload = {
            employee_id: rowData?._id,
            name: rowData?.name || '',
            date: dateKey,
            check_out: check_out_time

        };
        dispatch(checkINOutData(payload));
    };
    console.log('allEmployeeList', allEmployeeList)
    console.log('allAttendanceList', allAttendanceList)

    const checkInTemplete = (rowData) => {
        // const isDisable = allAttendanceList?.length > 0 ? allAttendanceList.find((item) => {

        //     const currentDate = new Date().toISOString().split('T')[0];
        //     if (item?.employee_id === rowData?._id) {
        //         if (item?.attendance_by_date[currentDate]?.check_in) {
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     }

        // }) : false;
        return (
            <Button severity="success" onClick={() => clickFunction(rowData)}>In</Button>
        );
    };

    const checkOutTemplete = (rowData) => {
        // const isDisable = allAttendanceList?.length > 0
        //     ? allAttendanceList.find((item) => {
        //         const currentDate = new Date().toISOString().split('T')[0];

        //         if (item?.employee_id === rowData?._id) {
        //             //     if (!item?.attendance_by_date[currentDate]?.check_in || item?.attendance_by_date[currentDate]?.check_out) {
        //             //         console.log('if')

        //             //         return true;
        //             // }

        //             if (item?.attendance_by_date[currentDate]?.check_out) {
        //                 return true;
        //             } else {
        //                 return false;
        //             }

        //         }

        //         // return false;
        //     })
        //     : true;
        return (
            <Button severity="danger" onClick={() => clickOutFunction(rowData)}>Out</Button>
        );
    };


    const tableColumns = [
        { field: 'name', header: "Name" },
        { field: 'check_in', header: "Check In", body: checkInTemplete },
        { field: 'check_out', header: "Check Out", body: checkOutTemplete },
    ]

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: selectedAttendanceData
    });

    const { getValues } = methods;
    const { check_status } = getValues();


    const onSubmit = async (data) => {
        let res = '';
        const payload = {
            ...data,
            modal_to_pass: "attendance"
        }

        if (data?._id) {
            res = await dispatch(updateItem(payload));
        }
        //  else {
        // res = await dispatch(addItem(payload));
        // }

        if (res) {
            // dispatch(setAllAttendanceList(res));
            dispatch(setProductDialog(false))
        }
    };

    const handleAddItem = () => {
        dispatch(setSelectedAttendanceData(initialState));
        methods.reset(initialState);
        dispatch(setAttendanceDialog(true))
    };

    const handleEditItem = async (attendance) => {
        console.log('attendance', attendance)
        dispatch(setAttendanceDialog(true))
        const payload = { modal_to_pass: "attendance", id: attendance?._id }
        const res = await dispatch(getSingleItem(payload))

        // const check_in_time = new Date();
        // const dateKey = check_in_time.toISOString().split('T')[0];
        // const in_time = dayjs(res.attendance_by_date["2024-09-20"].check_in).utc();
        const in_time = dayjs(dayjs().format('YYYY-MM-DD') +
            res.attendance_by_date["2024-09-20"].check_in,
            'YYYY-MM-DD HH:mm:ss',
        );
        const out_time = dayjs(dayjs().format('YYYY-MM-DD') +
            res.attendance_by_date["2024-09-20"].check_out,
            'YYYY-MM-DD HH:mm:ss',
        );
        // const out_time = dayjs(res.attendance_by_date["2024-09-20"].check_out).utc();
        // const formattedInTime = in_time.format('HH:mm');
        // const formattedOutTime = out_time.format('HH:mm');


        console.log('res', res)
        if (res) {
            dispatch(setSelectedAttendanceData({ check_in: in_time, check_out: out_time }));
            methods.reset(res);
        }
    };

    const actionBodyResponsiveTemplate = rowData => {
        return (
            <>
                <p className="text-left text-sm" onClick={() => handleEditItem(rowData)}>
                    Edit
                </p>
            </>
        );
    };

    const responsiveTableTemplete = rowData => {
        return (
            <div className="container flex flex-col border-white border-2 w-full">
                <div className="flex justify-center border-b-2 border-white p-2">
                    <Image
                        src={rowData.image}
                        alt={rowData.image || "Image not found"}
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
            {commonLoading && <Loader />}
            <CommonDataTable
                tableName="Attendance"
                moduleName='attendance'
                tableColumns={tableColumns}
                // allItemList={allAttendanceList}
                allItemList={allEmployeeList}
                handleAddItem={handleAddItem}
                handleEditItem={handleEditItem}
                // handleDeleteItem={handleDeleteItem}
                responsiveTableTemplete={responsiveTableTemplete}
                // deleteItemDialog={deleteProductDialog}
                // hideDeleteDialog={hideProductDeleteDialog}
                // deleteItem={handleDeleteProduct}
                selectedItemData={selectedAttendanceData}
            />

            <Dialog
                visible={attendanceDialog}
                style={{ width: "55rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={`${methods.watch('_id') ? 'Edit' : "Add"} Attendance`}
                modal
                className="p-fluid"
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
                                                options={[
                                                    { label: "In", value: 1 },
                                                    { label: "Out", value: 2 },
                                                ]}
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
                                    dispatch(setAttendanceDialog(false))
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
export default memo(Attendance);