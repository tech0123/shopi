"use client"
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { calcInitialValues, productsData } from '@/helper/commonValues';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProducts, setCalcValues, setSubTotal } from '@/store/slice/cartSlice';
import Image from 'next/image';

const SelectedProductsTable = () => {
    const dispatch = useDispatch()
    const { selectedProducts, subTotal, calcValues } = useSelector(({ cart }) => cart);
    const [error, setError] = useState([]);

    const Footer = () => {
        const handleCalcValueChange = (value, name) => {
            const parsedValue = parseFloat(value || 0);
            let grandTotal = 0;

            if (name === "tax") {
                const afterDiscount = parseFloat((subTotal - parseFloat((calcValues.discount * subTotal) / 100)));
                grandTotal = parseFloat(afterDiscount + parseFloat((parsedValue * afterDiscount) / 100)).toFixed(2);
            } else {
                const afterDiscount = parseFloat((subTotal - parseFloat((parsedValue * subTotal) / 100)));
                grandTotal = parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2);
            }

            dispatch(setCalcValues({
                ...calcValues,
                [name]: value,
                grandTotal: grandTotal
            }));
        };

        return (
            <div className="card !bg-gray-800 shadow-sm text-white p-5 ">
                <h5 className="text-md  font-medium mb-2">Summary</h5>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className=" text-sm">SubTotal:</span>
                        <span className="font-medium text-sm">{subTotal}</span>
                    </div>

                    <div className="flex justify-between items-center">
                    <span className=" text-sm">Discount:</span>
                        <InputNumber
                            placeholder="Discount"
                            name="discount"
                            className="text-sm  bg-gray-800 border-gray-600"
                            maxFractionDigits={2}
                            useGrouping={false}
                            value={calcValues?.discount}
                            onValueChange={(e) => handleCalcValueChange(e.target.value, e.target.name)}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className=" text-sm">Tax:</span>                        
                        <InputNumber
                            placeholder="Tax"
                            name="tax"
                            className="text-sm bg-gray-800 border-gray-600"
                            maxFractionDigits={2}
                            useGrouping={false}
                            value={calcValues?.tax}
                            onValueChange={(e) => handleCalcValueChange(e.target.value, e.target.name)}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <span className=" text-sm">Grand Total:</span>
                        <span className="font-medium text-sm">{calcValues.grandTotal}</span>
                    </div>
                </div>
            </div>
        );
    };

    const handleUnselectProduct = (data) => {
        const remainingSelectedProducts = selectedProducts?.filter(item => item.id !== data?.id);
        const calcSubTotal = parseFloat(remainingSelectedProducts?.reduce((total, product) => parseFloat(total || 0) + parseFloat(product.amount || 0), 0)).toFixed(2)
        const afterDiscount = parseFloat((calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)))
        dispatch(setSelectedProducts(remainingSelectedProducts));
        dispatch(setSubTotal(
            calcSubTotal
        ))
        if (remainingSelectedProducts?.length) {
            dispatch(setCalcValues({
                ...calcValues,
                grandTotal: parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2)
            }))
        }
        else {
            dispatch(setCalcValues(calcInitialValues))
        }
    } 

    const amountBody = (rowData) => {
        return parseFloat(rowData?.amount).toFixed(2);
    };

    const actionBodyTemplate = (data) => {
        return <Button type="button" disabled={!data?.qty} icon="pi pi-minus-circle" className='action-icon-size p-5' onClick={(e) => {handleUnselectProduct(data)}}
            rounded></Button>;
    };

    const multiBodyTemplate = (data) => {
        return (
            <div className="container flex flex-col  w-full">
                <div className="flex justify-center p-3">
                    <Image src={data?.image} alt={data?._id} width={100} height={100} />
                </div>

                <div className="flex flex-1 bg-gray-900">
                    <div className="flex-1  p-3">
                        {/* <p className='text-left'>Date: {new Date(data?.date).toLocaleDateString()}</p> */}
                        <p className='text-left'>QTY: {qtyBody(data)}</p>
                        <p className='text-left'>Stock: {data?.stock}</p>
                    </div>

                    <div className="flex-1 p-3 flex flex-col ">
                        <p className='text-left'>Discount: {discountBody(data)}</p>
                        <p className='text-left'>MRP: {data?.selling_price}</p>
                        <p className='text-left'>Amount: {data?.amount}</p>
                        <Button type="button" onClick={(e) => { handleUnselectProduct(data) }}>Remove</Button>
                    </div>
                </div>
            </div>
        );
    };

    const qtyBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = selectedProducts?.findIndex(customer => customer.id === data?.id);
            const newCustomers = [...selectedProducts];
            const amount = value <= data?.stock ? value * parseFloat(data?.selling_price) : data?.amount;
            const discount = value <= data?.stock ? data?.discount : 0;
            newCustomers[index] = { ...newCustomers[index], qty: value, amount: amount, discount: discount };
            dispatch(setSelectedProducts(newCustomers));

            setError(prevErrors => {
                const { [data?.id]: currentErrors = {} } = prevErrors;
                const { qty, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?.id]: _, ...otherErrors } = prevErrors; // Remove `data?.id` entry completely
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data?.id]: remainingErrors
                };
            });
            if (value > data?.stock) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data?.id]: {
                        ...prevErrors[data?.id],
                        qty: `Only ${data?.stock} is Left`
                    }
                }));
            }
            const calcSubTotal = parseFloat(newCustomers?.reduce((total, product) => parseFloat(total || 0) + parseFloat(product.amount || 0), 0)).toFixed(2)
            dispatch(setSubTotal(calcSubTotal))
            const afterDiscount = parseFloat((calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)))
            const grandTotal = parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2);

            dispatch(setCalcValues({
                ...calcValues,
                grandTotal: grandTotal
            }))
        };

        return (
            <>
                <InputText
                    name='qty'
                    keyfilter="int"
                    placeholder="Quantity"
                    disabled={!data?.stock || data?.stock === 0}
                    value={data?.qty === 0 ? "" : data?.qty}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onChange={handleChange}
                    className={`h-10 p-3 ${error[data?.id]?.qty ? 'border-red-500 border-2' : ''}`}
                />
                {error[data?.id]?.qty && <p className="text-red-500 mt-1">{error[data?.id]?.qty}</p>}
            </>
        );
    };

    const discountBody = (data) => {
        const handleChange = (e) => {
            const value = parseInt(e.target.value || 0);
            const index = selectedProducts?.findIndex(customer => customer.id === data?.id);
            const newCustomers = [...selectedProducts];
            const ogAmt = parseInt(data?.qty) * parseFloat(data?.selling_price);
            const amount = value <= ogAmt ? ((ogAmt) - value).toFixed(2) : (ogAmt);
            newCustomers[index] = { ...newCustomers[index], discount: value, amount: amount };
            dispatch(setSelectedProducts(newCustomers));
            setError(prevErrors => {
                const { [data?.id]: currentErrors = {} } = prevErrors;
                const { discount, ...remainingErrors } = currentErrors;
                if (Object.keys(remainingErrors).length === 0) {
                    const { [data?.id]: _, ...otherErrors } = prevErrors; // Remove `data?.id` entry completely
                    return otherErrors;
                }
                return {
                    ...prevErrors,
                    [data?.id]: remainingErrors
                };
            });

            if (value > ogAmt) {
                setError(prevErrors => ({
                    ...prevErrors,
                    [data?.id]: {
                        ...prevErrors[data?.id],
                        discount: `Equal or Less Than ${ogAmt}`
                    }
                }));
            }

            const calcSubTotal = parseFloat(newCustomers?.reduce((total, product) => parseFloat(total || 0) + parseFloat(product.amount || 0), 0)).toFixed(2)
            dispatch(setSubTotal(calcSubTotal))
            const afterDiscount = parseFloat((calcSubTotal - parseFloat((calcValues.discount * calcSubTotal) / 100)))
            const grandTotal = parseFloat(afterDiscount + parseFloat((calcValues.tax * afterDiscount) / 100)).toFixed(2);

            dispatch(setCalcValues({
                ...calcValues,
                grandTotal: grandTotal
            }))
        };

        return (
            <>
                <InputText
                    name='discount'
                    keyfilter="int"
                    placeholder="Discount"
                    disabled={!data?.stock || data?.stock === 0 || !data?.selling_price || !data?.qty || error[data?.id]?.qty}
                    value={data?.discount === 0 ? "" : data?.discount}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'minus') {
                            e.preventDefault();
                        }
                    }}
                    onBlur={handleChange}
                    onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        const index = selectedProducts?.findIndex(customer => customer.id === data?.id);
                        const newCustomers = [...selectedProducts];
                        newCustomers[index] = { ...newCustomers[index], discount: value };
                        dispatch(setSelectedProducts(newCustomers));
                    }}
                    className={`h-10 p-3 ${error[data?.id]?.discount ? 'border-red-500 border-2' : ''}`}
                />
                {error[data?.id]?.discount && <p className="text-red-500 mt-1">{error[data?.id]?.discount}</p>}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 max-w-1rem lg:max-w-1rem">
                <Image alt={rowData?._id} src={rowData?.image} height={150} width={150} style={{ maxWidth: "4rem" }} className="max-w-1rem lg:max-w-1rem shadow-2 border-round" />
            </div>
        );
    };

    return (
        <div className="card !border-none !bg-gray-800">
            <DataTable
                className='max-xl:hidden'
                value={selectedProducts} paginator rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                emptyMessage="No Products Found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                <Column header="" body={imageBodyTemplate} className="pl-5" />
                <Column header="Qty" field="qty" body={qtyBody} style={{ minWidth: '14rem' }} />
                <Column header="Stock" field="stock" />
                <Column header="Discount" field="discount" body={discountBody} style={{ minWidth: '14rem' }} />
                <Column header="MRP" field="selling_price" sortable />
                <Column header="Amount" field="amount" body={amountBody} />
                <Column headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
            </DataTable>

            <DataTable className="block xl:hidden" value={selectedProducts} paginator rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                emptyMessage="No Products found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
                <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={multiBodyTemplate} />
            </DataTable>

            <Footer />
        </div>
    )
}

export default SelectedProductsTable