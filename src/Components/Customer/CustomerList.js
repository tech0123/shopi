"use client";
import React, { useCallback, useEffect } from "react";
import * as yup from "yup";
import {
    setDeleteCustomerDialog,
    setCustomerDialog,
    setSelectedCustomerData
} from "@/store/slice/customerSlice";
import _ from 'lodash';
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import CommonDataTable from "@/helper/CommonComponent/CommonDataTable";
import { addItem, deleteItem, getAllDataList, getSingleItem, updateItem, setCurrentPage, setPageLimit, setSearchParam } from "@/store/slice/commonSlice";
import Loader from "@/helper/CommonComponent/Loader";
import { customerTypeOptions, customer_search_key } from "@/helper/commonValues";
import Image from "next/image";

const initialState = {
    image: '',
    name: "",
    email: '',
    mobile_number: "",
    type: '',
}

const schema = yup.object().shape({
    name: yup.string().required("Please enter Name."),
    email: yup.string().email().required("Please enter Email."),
    mobile_number: yup.string().required("Please enter Mobile Number."),
    type: yup.string().required("Please enter Type."),
});


const imageBodyTemplate = rowData => {
    return (
        <Image
            src={rowData?.image || ''}
            alt={rowData?._id || "Image not found"}
            className="shadow-2 border-round"
            width={150}
            height={150}
            style={{ objectFit: "cover" }}
        />
    );
};

const tableColumns = [
    { field: "image", header: "Image", body: imageBodyTemplate },
    { field: "name", header: "Name" },
    { field: "email", header: "Email" },
    { field: "mobile_number", header: "Mobile Number" },
    { field: "type", header: "Type" },
];

const inputFieldsList = [
    { fieldTitle: "Name", fieldId: "Name", fieldName: 'name', fieldRequired: true },
    { fieldTitle: "Email", fieldId: "Email", fieldName: 'email', fieldRequired: true },
    { fieldTitle: "Mobile Number", fieldId: "MobileNumber", fieldName: 'mobile_number', fieldRequired: true },
    { fieldTitle: "Type", fieldId: "Type", fieldName: 'type', type: 'single_select', options: customerTypeOptions, fieldRequired: true },
    { fieldTitle: "Image", fieldId: "Image", fieldName: 'image' },
]

const CustomerList = () => {
    const dispatch = useDispatch();

    const { allCustomerList, selectedCustomerData, customerDialog, deleteCustomerDialog } = useSelector(({ customer }) => customer);
    const { commonLoading, currentPage, searchParam, pageLimit } = useSelector(({ common }) => common)

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: selectedCustomerData
    });

    const fetchCustomersData = useCallback(async (
        start = 1,
        limit = 7,
        search = ''
    ) => {
        const payload = {
            modal_to_pass: "Customers",
            search_key: customer_search_key,
            start: start,
            limit: limit,
            search: search?.trim(),
        };
        const res = await dispatch(getAllDataList(payload));

    }, [dispatch]);

    useEffect(() => {
        fetchCustomersData(
            currentPage,
            pageLimit,
            searchParam
        );
    }, []);

    const onPageChange = page => {
        if (page !== currentPage) {
            let pageIndex = currentPage;
            if (page?.page === 'Prev') pageIndex--;
            else if (page?.page === 'Next') pageIndex++;
            else pageIndex = page;

            dispatch(setCurrentPage(pageIndex));
            fetchCustomersData(
                pageIndex,
                pageLimit,
                searchParam,

            );
        }
    };

    const onPageRowsChange = page => {
        dispatch(setCurrentPage(page === 0 ? 0 : 1));
        dispatch(setPageLimit(page));
        const pageValue =
            page === 0
                ? allCustomerList?.totalRows
                    ? allCustomerList?.totalRows
                    : 0
                : page;
        const prevPageValue =
            pageLimit === 0
                ? allCustomerList?.totalRows
                    ? allCustomerList?.totalRows
                    : 0
                : pageLimit;
        if (
            prevPageValue < allCustomerList?.totalRows ||
            pageValue < allCustomerList?.totalRows
        ) {
            fetchCustomersData(
                page === 0 ? 0 : 1,
                page,
                searchParam,

            );
        }
    };

    const onSubmit = async (data) => {
        let res = '';
        const payload = {
            ...data,
            type: Number(data.type),
            modal_to_pass: "customer",
            search_key: customer_search_key,
            start: currentPage,
            limit: pageLimit,
            search: searchParam,
        }

        if (data?._id) {
            res = await dispatch(updateItem(payload))
        } else {
            res = await dispatch(addItem(payload))
        }
        if (res?.payload) {

            dispatch(setCustomerDialog(false))
        }
    };

    const handleSearchInput = e => {
        dispatch(setCurrentPage(1));

        fetchCustomersData(
            currentPage,
            pageLimit,
            e.target.value?.trim(),
        );
    };

    const handleChangeSearch = e => {
        debounceHandleSearchInput(e);
        dispatch(setSearchParam(e.target.value));
    }

    const debounceHandleSearchInput = useCallback(
        _.debounce(e => {
            handleSearchInput(e);
        }, 800),
        [],
    );

    const handleAddItem = () => {
        dispatch(setSelectedCustomerData(initialState));
        methods.reset(initialState);
        dispatch(setCustomerDialog(true));
    };

    const handleEditItem = async (customer) => {
        const payload = { modal_to_pass: "customer", id: customer }

        dispatch(setCustomerDialog(true));
        const res = await dispatch(getSingleItem(payload))

        if (res?.payload) {
            methods.reset(res?.payload);
        }
    };

    const handleDeleteItem = customer => {
        dispatch(setSelectedCustomerData(customer));
        methods.reset(customer);
        dispatch(setDeleteCustomerDialog(true));
    };

    const hideProductDeleteDialog = () => {
        dispatch(setDeleteCustomerDialog(false));
    };

    const handleDeleteProduct = async () => {
        const payload = {
            modal_to_pass: 'customer',
            search_key: customer_search_key,
            id: selectedCustomerData?._id,
            start: currentPage,
            limit: pageLimit,
            search: searchParam
        };
        const res = await dispatch(deleteItem(payload))
        if (res?.payload) {

            dispatch(setDeleteCustomerDialog(false));
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
                        src={rowData?.image || ''}
                        alt={rowData?._id || "Image not found"}
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
                            Type: {rowData?.type}
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
                tableName="Customers"
                moduleName='customer'
                tableColumns={tableColumns}
                allItemList={allCustomerList}
                handleChangeSearch={handleChangeSearch}
                searchParam={searchParam}
                handleAddItem={handleAddItem}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
                responsiveTableTemplete={responsiveTableTemplete}
                deleteItemDialog={deleteCustomerDialog}
                hideDeleteDialog={hideProductDeleteDialog}
                deleteItem={handleDeleteProduct}
                pageLimit={pageLimit}
                onPageChange={onPageChange}
                onPageRowsChange={onPageRowsChange}
                currentPage={currentPage}
            />

            <Dialog
                visible={customerDialog}
                style={{ width: "55rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header={`${methods.watch('_id') ? 'Edit' : "Add"} Customer`}
                modal
                className="p-fluid"
                onHide={() => dispatch(setCustomerDialog(false))}
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
                                    )
                                })}
                            </Row>
                        </div>
                        <div className="mt-3 me-2 flex justify-end items-center gap-4">
                            <Button
                                className="btn_transparent"
                                onClick={e => {
                                    e.preventDefault();
                                    dispatch(setCustomerDialog(false))
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
export default CustomerList;