'use client';
// import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ProductService } from './service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Fragment, useEffect, useRef, useState } from 'react';
import { sampleProducts } from '@/helper/commonValues';
import Image from 'next/image';



// Example of using the sample data in your component


export default function ProductCrud() {
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        available_quantity: '',
        discount: '',
        tax: '',
        selling_price: '',
        cost_price: '',
    };
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        setProducts(sampleProducts);
    }, []);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const response = await fetch("/api/products/getProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // body: JSON.stringify({})
            });

            const result = await response.json();
            console.log("result", result);
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                try {
                    _product.id = createId();
                    _product.image = 'product-placeholder.svg';
                    _products.push(_product);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    const response = await fetch("/api/products/addProduct", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: _product.name,
                            description: _product.description,
                            available_quantity: _product.available_quantity,
                            discount: _product.discount,
                            tax: _product.tax,
                            selling_price: _product.selling_price,
                            cost_price: _product.cost_price
                        })
                    });

                    const result = await response.json();
                    console.log("result", result);
                } catch (error) {
                    console.error("Error:", error);
                    throw error;
                }

            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    // const leftToolbarTemplate = () => {
    //     return (
    //         <div className="flex flex-wrap gap-2">
    //             <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
    //             <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
    //         </div>
    //     );
    // };

    const centerToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <h4 className="m-0 text-white">Manage Products</h4>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </Fragment>
        );

    };
    const actionBodyResponsiveTemplate = (rowData) => {
        return (
            <Fragment>
                <p className='text-left text-sm' onClick={() => editProduct(rowData)}>Edit</p>
                <p className='text-left text-sm' onClick={() => confirmDeleteProduct(rowData)}>Delete</p>
            </Fragment>
        );

    };

    const responsiveTemplete = (rowData) => {
        return (
            <div className="container flex flex-col border-white border-2 w-full">
                <div className="flex justify-center border-b-2 border-white p-2">
                    <Image src={`/${rowData.image}`} alt="image" width={150} height={150} />
                </div>
                <div className="flex flex-1 flex-col md:flex-row">
                    <div className="flex-1 border-r-2 border-white p-2">
                        <p className='text-left text-sm'>ID: {rowData.id}</p>
                        <p className='text-left text-sm'>Name: {rowData.name}</p>
                        <p className='text-left text-sm'>Description: {rowData.description}</p>
                        <p className='text-left text-sm'>Available Qty: {rowData.available_quantity}</p>
                    </div>

                    <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
                        <p className='text-left text-sm'>Discount: {rowData.discount}</p>
                        <p className='text-left text-sm'>Tax: {rowData.tax}</p>
                        <p className='text-left text-sm'>Selling Price: {rowData.selling_price}</p>
                        <p className='text-left text-sm'>Cost Price: {rowData.cost_price}</p>
                        <div className='text-left mt-1'>
                            {actionBodyResponsiveTemplate(rowData)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            {/* <h4 className="m-0">Manage Products</h4> */}
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </Fragment>
    );
    const deleteProductDialogFooter = (
        <Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </Fragment>
    );
    const deleteProductsDialogFooter = (
        <Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </Fragment>
    );
    console.log('products', products)
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" center={centerToolbarTemplate}
                // right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    {/* <Column selectionMode="multiple" exportable={false}></Column> */}
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="available_quantity" header="Available Quantity" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="discount" header="Discount" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="tax" header="Tax" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="selling_price" header="Selling Price" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="cost_price" header="Cost Price" sortable style={{ minWidth: '16rem' }}></Column>
                    {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
                    {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
                <DataTable
                    className='mt-10 block xl:hidden'
                    ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    {/* <Column selectionMode="multiple" exportable={false}></Column> */}
                    {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="description" header="Description" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="available_quantity" header="Available Quantity" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="discount" header="Discount" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="tax" header="Tax" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="selling_price" header="Selling Price" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="cost_price" header="Cost Price" sortable style={{ minWidth: '16rem' }}></Column> */}
                    {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
                    {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={responsiveTemplete} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                {/* <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.email })} />
                    {submitted && !product.email && <small className="p-error">Email is required.</small>}
                </div> */}
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                    {submitted && !product.description && <small className="p-error">Description is required.</small>}

                </div>
                <div className="field">
                    <label htmlFor="available_quantity" className="font-bold">
                        Available Quantity
                    </label>
                    <InputText id="available_quantity" value={product.available_quantity} onChange={(e) => onInputChange(e, 'available_quantity')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.available_quantity })} />
                    {submitted && !product.available_quantity && <small className="p-error">Available Quantity is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="discount" className="font-bold">
                        Discount
                    </label>
                    <InputText id="discount" value={product.discount} onChange={(e) => onInputChange(e, 'discount')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.discount })} />
                    {submitted && !product.discount && <small className="p-error">Discount is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="tax" className="font-bold">
                        Tax
                    </label>
                    <InputText id="tax" value={product.tax} onChange={(e) => onInputChange(e, 'tax')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.tax })} />
                    {submitted && !product.tax && <small className="p-error">Tax is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="selling_price" className="font-bold">
                        Selling Price
                    </label>
                    <InputText id="selling_price" value={product.selling_price} onChange={(e) => onInputChange(e, 'selling_price')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.selling_price })} />
                    {submitted && !product.selling_price && <small className="p-error">Selling Price is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="cost_price" className="font-bold">
                        Cost Price
                    </label>
                    <InputText id="cost_price" value={product.cost_price} onChange={(e) => onInputChange(e, 'cost_price')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.cost_price })} />
                    {submitted && !product.cost_price && <small className="p-error">Cost Price is required.</small>}
                </div>

            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}
