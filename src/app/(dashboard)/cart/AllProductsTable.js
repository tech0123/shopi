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
import React, { useState, useEffect, useCallback } from 'react';
import { setAllProductList, setCalcValues, setSelectedProducts, setSubTotal } from '@/store/slice/cartSlice';

const AllProductsTable = () => {
    const dispatch = useDispatch()
    const [error, setError] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const { selectedProducts, calcValues, subTotal, allProductList } = useSelector(({ cart }) => cart);
    const [filters, setFilters] = useState({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

    const fetchProductList = useCallback(async () => {
        const payload = { modal_to_pass: "Products" }
        const res = await dispatch(getAllDataList(payload))
        if (res) {
            console.log('%c%s', 'color: lime', '===> res:', res);
            dispatch(setAllProductList(modifyProducts(res)))
        }
    }, [])

    useEffect(() => {
        fetchProductList()
    }, []);

    const modifyProducts = (data) => {
        return [...(data || [])]?.map((d) => {
            // d.date = new Date(d.date);
            d.stock = d.available_quantity;
            d.qty = 0;
            d.discount = 0;
            d.amount = 0;
            return d;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        debounceFilter(value);
    };

    const debounceFilter = useCallback(
        _.debounce((value) => {
            let _filters = { ...filters };
            _filters['global'].value = value;
            setFilters(_filters);
        }, 800),
        [filters]
    );

    const header = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center m-4">
                {/* <h4 className="m-0">Customers</h4> */}
                <IconField iconPosition="right" className='min-w-full min-h-10'>
                    <InputIcon className="pi pi-search mr-5" />
                    <InputText className='min-w-full h-10 p-3 text-white' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
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
        return parseFloat(rowData.amount).toFixed(2);
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
        setGlobalFilterValue('');
        setFilters({
            ...filters,
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
        const i = allProductList.findIndex((item) => { return item.id === data?._id });
        if (i !== -1) {
            const updatedList = [
                ...allProductList.slice(0, i),
                { ...allProductList[i], qty: '', discount: '' },
                ...allProductList.slice(i + 1),
            ];
            dispatch(setAllProductList([...allProductList]));
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
                        <p className='text-left'>QTY: {qtyBody(data)}</p>
                        <p className='text-left'>Stock: {data.stock}</p>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 p-3 flex flex-col">
                        <p className='text-left'>Discount: {discountBody(data)}</p>
                        <p className='text-left'>MRP: {data.selling_price}</p>
                        <p className='text-left'>Amount: {data.amount}</p>
                        <Button type="button" disabled={!data.qty || error[data?._id]} onClick={(e) => { handleSelectProduct(data) }}>ADD</Button>
                    </div>

                </div>
            </div>
        );
    };

    const qtyBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = allProductList?.findIndex(product => product._id === data?._id);
            const newProduct = [...allProductList];
            const amount = value <= data.stock ? value * parseFloat(data.selling_price) : data.amount;
            const discount = value <= data.stock ? data.discount : 0;
            newProduct[index] = { ...newProduct[index], qty: value, amount: amount, discount: discount };
            dispatch(setAllProductList(newProduct));
            setError(prevErrors => {
                const { [data?._id]: currentErrors = {} } = prevErrors;
                const { qty, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?._id]: _, ...otherErrors } = prevErrors; // Remove `data?._id` entry completely
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data?._id]: remainingErrors
                };
            });
            if (value > data.stock) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data?._id]: {
                        ...prevErrors[data?._id],
                        qty: `Only ${data.stock} is Left`
                    }
                }));
            }
        };

        return (
            <>
                <InputText
                    keyfilter="int"
                    placeholder="Integers"
                    disabled={!data.stock || data.stock === 0}
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

    const discountBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = allProductList?.findIndex(product => product._id === data?._id);
            const newProduct = [...allProductList];
            const ogAmt = parseInt(data.qty) * parseFloat(data.selling_price);
            const amount = value <= ogAmt ? ((ogAmt) - value).toFixed(2) : (ogAmt);
            newProduct[index] = { ...newProduct[index], discount: value, amount: amount };
            dispatch(setAllProductList(newProduct));
            setError(prevErrors => {
                const { [data?._id]: currentErrors = {} } = prevErrors;
                const { discount, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?._id]: _, ...otherErrors } = prevErrors; // Remove `data?._id` entry completely
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
                    disabled={!data.stock || data.stock === 0 || !data.selling_price || !data.qty || error[data?._id]?.qty}
                    value={data.discount === 0 ? "" : data.discount}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onBlur={handleChange}
                    onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        const index = allProductList?.findIndex(product => product._id === data?._id);
                        const newProduct = [...allProductList];
                        newProduct[index] = { ...newProduct[index], discount: value };
                        dispatch(setAllProductList(newProduct));
                    }}
                    className={`w-full h-10 p-3 ${error[data?._id]?.discount ? 'border-red-500 border-2' : ''}`}
                />
                {error[data?._id]?.discount && <small className="text-red-500 mt-1">{error[data?._id]?.discount}</small>}
            </>
        );
    };

    return (
        <div className="card !border-none !bg-gray-800">
            <DataTable
                className='max-xl:hidden'
                value={globalFilterValue === "" ? [{}] : allProductList?.filter((p) => !selectedProducts?.some(s => s?._id === p._id))} paginator={!!globalFilterValue} header={header} rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                filters={filters} filterDisplay="menu" globalFilterFields={['name']}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                {globalFilterValue ? <Column header="" body={imageBodyTemplate} className="pl-5" /> : null}
                {globalFilterValue ? <Column header="Qty" field="qty" body={qtyBody} style={{ minWidth: '14rem' }} /> : null}
                {globalFilterValue ? <Column header="Stock" field="stock" /> : null}
                {globalFilterValue ? <Column header="Discount" field="discount" body={discountBody} style={{ minWidth: '14rem' }} /> : null}
                {globalFilterValue ? <Column header="MRP" field="selling_price" sortable /> : null}
                {globalFilterValue ? <Column header="Amount" field="amount" body={amountBody} /> : null}
                {globalFilterValue ? <Column headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} /> : null}
            </DataTable>
            <DataTable
                className='block xl:hidden'
                value={globalFilterValue === "" ? [{}] : allProductList?.filter((p) => !selectedProducts?.some(s => s.id === p.id))} paginator={!!globalFilterValue} header={header} rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                filters={filters} filterDisplay="menu" globalFilterFields={['name']}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                {globalFilterValue ? <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={multiBodyTemplate} /> : null}
            </DataTable>
        </div>
    )
}

export default AllProductsTable