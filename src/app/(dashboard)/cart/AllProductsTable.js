"use client"
import _ from 'lodash';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDataList } from '@/store/slice/commonSlice';
import { setCalcValues, setSelectedProducts, setSubTotal } from '@/store/slice/cartSlice';
import React, { useState, useEffect, useCallback } from 'react';
import {
    setAllProductList,
    setCurrentPage,
    setPageLimit,
    setSearchParam,
} from "@/store/slice/productItemSlice";
import CustomPaginator from '@/helper/CommonComponent/CustomPaginator';
const AllProductsTable = () => {
    const dispatch = useDispatch()
    const [error, setError] = useState([]);
    const { selectedProducts, calcValues, subTotal } = useSelector(({ cart }) => cart);
    const { allProductList, currentPage,
        pageLimit,
        searchParam, } = useSelector(({ productItem }) => productItem)
    const fetchProductList = useCallback(async (start = 1,
        limit = 7,
        search = '') => {
        const payload = {
            modal_to_pass: "Products", start: start,
            limit: limit,
            search: search?.trim(),
        }
        const res = await dispatch(getAllDataList(payload))
        // if (res) {
        //     dispatch(setAllProductsData(modifyProducts(res)))
        // }
    }, [])
    // const allProductsData = allProductList?.list?.map((d) => ({
    //     ...d,
    //     qty: 0,
    //     discount: 0,
    //     amount: 0
    // }));

    const modifyProducts = (data) => {
        return [...(data || [])].map((d) => ({
            ...d,
            qty: 0,
            discount: 0,
            amount: 0
        }));
    };

    // const modifyProducts = (data) => {
    //     return [...(data || [])]?.map((d) => {
    //         // d.date = new Date(d.date);
    //         d.qty = 0;
    //         d.discount = 0;
    //         d.amount = 0;
    //         return d;
    //     });
    // };
    const allProductsData = allProductList?.list

    useEffect(() => {
        fetchProductList(currentPage,
            pageLimit,
            searchParam)
    }, []);
    console.log('allProductsData', allProductsData)



    const handleSearchInput = e => {
        dispatch(setCurrentPage(1));

        fetchProductList(
            currentPage,
            pageLimit,
            e.target.value?.trim(),
        );
    };
    const debounceHandleSearchInput = useCallback(
        _.debounce(e => {
            handleSearchInput(e);
        }, 800),
        [],
    );
    const onPageChange = page => {
        if (page !== currentPage) {
            let pageIndex = currentPage;
            if (page?.page === 'Prev') pageIndex--;
            else if (page?.page === 'Next') pageIndex++;
            else pageIndex = page;

            dispatch(setCurrentPage(pageIndex));
            fetchProductList(
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
                ? allProductList?.totalRows
                    ? allProductList?.totalRows
                    : 0
                : page;
        const prevPageValue =
            pageLimit === 0
                ? allProductList?.totalRows
                    ? allProductList?.totalRows
                    : 0
                : pageLimit;
        if (
            prevPageValue < allProductList?.totalRows ||
            pageValue < allProductList?.totalRows
        ) {
            fetchProductList(
                page === 0 ? 0 : 1,
                page,
                searchParam,

            );
        }
    };

    const header = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center m-4">
                {/* <h4 className="m-0">Customers</h4> */}
                <IconField iconPosition="right" className='min-w-full min-h-10'>
                    <InputIcon className="pi pi-search mr-3 " />
                    <InputText
                        id="search"
                        placeholder="Search"
                        type="search"
                        className="input_wrap small search_wrap"
                        value={searchParam}
                        onChange={(e) => {
                            debounceHandleSearchInput(e);
                            dispatch(setSearchParam(e.target.value));
                        }}
                    />
                </IconField>
            </div>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 max-w-1rem lg:max-w-1rem">
                <Image alt={rowData._id} src={rowData.image} height={100} width={100} style={{ objectFit: 'cover' }} className="max-w-1rem lg:max-w-1rem shadow-2 border-round rounded" />
            </div>
        );
    };

    const amountBody = (rowData) => {
        console.log('rowData', rowData)
        return parseFloat(rowData.amount || 0).toFixed(2);
    };

    const handleSelectProduct = (data) => {
        const updatedSelectedProducts = [...selectedProducts, data];
        const calSubTotal = parseFloat(updatedSelectedProducts?.reduce((total, product) => parseFloat(total || 0) + parseFloat(product?.amount || 0), 0)).toFixed(2)
        const afterDiscount = parseFloat((calSubTotal - parseFloat((calcValues.discount * calSubTotal) / 100)));
        dispatch(setSelectedProducts(updatedSelectedProducts));
        dispatch(setSubTotal(
            calSubTotal
        ))
        dispatch(setCalcValues({
            ...calcValues,
            grandTotal: parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2)
        }))
        setSearchParam('');

        const i = allProductsData.findIndex((item) => { return item._id === data?._id });
        if (i !== -1) {
            const updatedList = [
                ...allProductsData.slice(0, i),
                { ...allProductsData[i], qty: '', discount: '' },
                ...allProductsData.slice(i + 1),
            ];
            dispatch(setAllProductList({
                ...allProductList,
                list: [...allProductsData]
            }));
        }
    }

    const actionBodyTemplate = (data) => {
        return <Button type="button" disabled={!data.qty || error[data?._id]} icon="pi pi-plus-circle" className='action-icon-size p-5' onClick={(e) => { handleSelectProduct(data) }} rounded></Button>;
    };

    const multiBodyTemplate = (data) => {
        return (
            <div className="container flex flex-col w-full">

                {/* Centered Image */}
                <div className="flex justify-center p-3">
                    <Image src={data.image} alt={data?._id} width={150} height={150} />
                </div>

                {/* Bottom Sections */}
                <div className="flex flex-1 bg-gray-900 ">

                    {/* Left Section */}
                    <div className="flex-1 p-3">
                        <p className='text-left'>Name: {data.name}</p>
                        <p className='text-left'>QTY: {qtyBody(data)}</p>
                        <p className='text-left'>Available Quantity: {data.available_quantity}</p>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 p-3 flex flex-col">
                        <p className='text-left'>Discount: {discountBody(data)}</p>
                        <p className='text-left'>MRP: {data.selling_price}</p>
                        <p className='text-left'>Amount: {data.amount || 0}</p>
                        <Button type="button" disabled={!data.qty || error[data?._id]} onClick={(e) => { handleSelectProduct(data) }}>ADD</Button>
                    </div>

                </div>
            </div>
        );
    };

    const qtyBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = allProductsData?.findIndex(product => product._id === data?._id);
            const newProduct = [...allProductsData];
            const amount = value <= data.available_quantity ? value * parseFloat(data.selling_price) : data.amount;
            const discount = value <= data.available_quantity ? data.discount : 0;
            newProduct[index] = { ...newProduct[index], qty: value, amount: amount, discount: discount };
            dispatch(setAllProductList({ ...allProductList, list: newProduct }));
            setError(prevErrors => {
                const { [data?._id]: currentErrors = {} } = prevErrors;
                const { qty, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?._id]: _, ...otherErrors } = prevErrors;
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data?._id]: remainingErrors
                };
            });
            if (value > data.available_quantity) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data?._id]: {
                        ...prevErrors[data?._id],
                        qty: `Only ${data.available_quantity} is Left`
                    }
                }));
            }
        };

        return (
            <>
                <InputText
                    keyfilter="int"
                    placeholder="Integers"
                    disabled={!data.available_quantity || data.available_quantity === 0}
                    value={data.qty === 0 ? "" : data.qty}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onChange={handleChange}
                    className={`w-full h-10 p-3 ${error[data?._id]?.qty ? 'border-red-500 border-2' : ''}`}
                />
                {error[data?._id]?.qty && <small className="text-red-500 mt-1">{error[data?._id]?.qty}</small>}
            </>
        );
    };
    console.log('allProductList', allProductList)
    const discountBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = allProductsData?.findIndex(product => product._id === data?._id);
            const newProduct = [...allProductsData];
            const ogAmt = parseInt(data.qty) * parseFloat(data.selling_price);
            const amount = value <= ogAmt ? ((ogAmt) - value).toFixed(2) : (ogAmt);
            newProduct[index] = { ...newProduct[index], discount: value, amount: amount };
            dispatch(setAllProductList({ ...allProductList, list: newProduct }));
            setError(prevErrors => {
                const { [data?._id]: currentErrors = {} } = prevErrors;
                const { discount, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?._id]: _, ...otherErrors } = prevErrors;
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data?._id]: remainingErrors
                };
            });

            if (value > ogAmt) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data?._id]: {
                        ...prevErrors[data?._id],
                        discount: `Equal or Less Than ${ogAmt}`
                    }
                }));
            }
        };

        return (
            <>
                <InputText
                    keyfilter="int"
                    placeholder="Integers"
                    disabled={!data.available_quantity || data.available_quantity === 0 || !data.selling_price || !data.qty || error[data?._id]?.qty}
                    value={data.discount === 0 ? "" : data.discount}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onBlur={handleChange}
                    onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        const index = allProductsData?.findIndex(product => product._id === data?._id);
                        const newProduct = [...allProductsData];
                        newProduct[index] = { ...newProduct[index], discount: value };
                        dispatch(setAllProductList({ ...allProductList, list: newProduct }));
                    }}
                    className={`w-full h-10 p-3 ${error[data?._id]?.discount ? 'border-red-500 border-2' : ''}`}
                />
                {error[data?._id]?.discount && <small className="text-red-500 mt-1">{error[data?._id]?.discount}</small>}
            </>
        );
    };
    console.log('allProductsData', allProductsData)
    return (
        <div className="card !border-none !bg-gray-800">
            <DataTable
                className='max-xl:hidden'
                value={searchParam === "" ? [{}] : allProductsData?.filter((p) => !selectedProducts?.some(s => s?._id === p._id))} header={header} rows={10}
            >
                {searchParam ? <Column header="" body={imageBodyTemplate} className="pl-5" /> : null}
                {searchParam ? <Column header="Name" field="name" /> : null}
                {searchParam ? <Column header="Qty" field="qty" body={qtyBody} style={{ minWidth: '14rem' }} /> : null}
                {searchParam ? <Column header="Available Quantity" field="available_quantity" /> : null}
                {searchParam ? <Column header="Discount" field="discount" body={discountBody} style={{ minWidth: '14rem' }} /> : null}
                {searchParam ? <Column header="MRP" field="selling_price" sortable /> : null}
                {searchParam ? <Column header="Amount" field="amount" body={amountBody} /> : null}
                {searchParam ? <Column headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} /> : null}
            </DataTable>
            <DataTable
                className='block xl:hidden'
                value={searchParam === "" ? [{}] : allProductsData?.filter((p) => !selectedProducts?.some(s => s._id === p._id))} header={header} rows={10}
            >
                {searchParam ? <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={multiBodyTemplate} /> : null}
            </DataTable>
            {searchParam &&
                <CustomPaginator
                    dataList={allProductsData}
                    pageLimit={pageLimit}
                    onPageChange={onPageChange}
                    onPageRowsChange={onPageRowsChange}
                    currentPage={currentPage}
                    totalCount={allProductList?.totalRows}
                />}
        </div>
    )
}

export default AllProductsTable