"use client";
// import React, { useState, useEffect, useRef } from 'react';
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from './service/ProductService';
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Fragment, useEffect, useRef, useState } from "react";
import { sampleUser } from "@/helper/commonValues";
import Image from "next/image";

// Example of using the sample data in your component

export default function UserCrud() {
  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    email: "",
    address: "",
    mobileNo: "",
    shopName: "",
    gstNo: ""
    // category: null,
    // price: 0,
    // quantity: 0,
    // rating: 0,
    // inventoryStatus: 'INSTOCK'
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
    setProducts(sampleUser);
  }, []);

  // useEffect(() => {
  //     ProductService.getProducts().then((data) => setProducts(data));
  // }, []);

  const onSubmit = async data => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          address: data.address,
          mobileNo: data.mobileNo,
          shopName: data.shopName,
          gstNo: data.gstNo
        })
      });

      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const formatCurrency = value => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
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
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000
        });
      } else {
        try {
          _product.id = createId();
          _product.image = "product-placeholder.svg";
          _products.push(_product);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000
          });

          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(_product)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          console.log("result", result); // Log the full response
          onSubmit(result);
          return result; // Return the result for further processing
        } catch (error) {
          console.error("Error:", error);
          throw error; // Re-throw the error for error boundaries or other error handling
        }
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = product => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = product => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter(val => val.id !== product.id);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000
    });
  };

  const findIndexById = id => {
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
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
    let _products = products.filter(val => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000
    });
  };

  const onCategoryChange = e => {
    let _product = { ...product };

    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
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
        <h4 className="m-0 text-white">Manage Customers</h4>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const imageBodyTemplate = rowData => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
        alt={rowData.image}
        className="shadow-2 border-round"
        style={{ width: "64px" }}
      />
    );
  };

  const priceBodyTemplate = rowData => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = rowData => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = rowData => {
    return (
      <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)} />
    );
  };

  const actionBodyTemplate = rowData => {
    return (
      <Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </Fragment>
    );
  };

  const responciveTemplete = rowData => {
    return (
      <div className="container flex flex-col border-white border-2 w-full">
        <div className="flex justify-center border-b-2 border-white p-2">
          <Image
            src={`/${rowData.image}`}
            alt="image"
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
              Email: {rowData.email}
            </p>
            <p className="text-left text-sm">
              Address: {rowData.address}
            </p>
          </div>

          <div className="flex-1 border-l-2 border-white p-2 flex flex-col">
            <p className="text-left text-sm">
              Mobile Number: {rowData.mobileNo}
            </p>
            <p className="text-left text-sm">
              Shop Name: {rowData.shopName}
            </p>
            <p className="text-left text-sm">
              GST No: {rowData.gstNo}
            </p>
            <div className="text-left mt-1">
              {actionBodyTemplate(rowData)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSeverity = product => {
    switch (product.inventoryStatus) {
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

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      {/* <h4 className="m-0">Manage Products</h4> */}
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={e => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
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
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </Fragment>
  );
  const deleteProductsDialogFooter = (
    <Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          center={centerToolbarTemplate}
          // right={rightToolbarTemplate}
        />

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={e => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          {/* <Column selectionMode="multiple" exportable={false}></Column> */}
          <Column field="image" header="Image" body={imageBodyTemplate} />
          <Column
            field="id"
            header="Id"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="email"
            header="Email"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="address"
            header="Address"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="mobileNo"
            header="Mobile Number"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="shopName"
            header="Shop Name"
            sortable
            style={{ minWidth: "16rem" }}
          />
          <Column
            field="gstNo"
            header="GST No"
            sortable
            style={{ minWidth: "16rem" }}
          />
          {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
          {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
          {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
        <DataTable
          className="mt-10 block xl:hidden"
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={e => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          {/* <Column selectionMode="multiple" exportable={false}></Column> */}
          {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="address" header="Address" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="mobileNo" header="Mobile Number" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="shopName" header="Shop Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="gstNo" header="GST No" sortable style={{ minWidth: '16rem' }}></Column> */}
          {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
          {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
          {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          {/* <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column> */}
          <Column
            body={responciveTemplete}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        {product.image &&
          <img
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.image}
            className="product-image block m-auto pb-3"
          />}
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <InputText
            id="name"
            value={product.name}
            onChange={e => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.name })}
          />
          {submitted &&
            !product.name &&
            <small className="p-error">Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <InputText
            id="email"
            value={product.email}
            onChange={e => onInputChange(e, "email")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.email })}
          />
          {submitted &&
            !product.email &&
            <small className="p-error">Email is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="address" className="font-bold">
            Address
          </label>
          <InputTextarea
            id="address"
            value={product.address}
            onChange={e => onInputChange(e, "address")}
            required
            rows={3}
            cols={20}
          />
          {submitted &&
            !product.address &&
            <small className="p-error">Address is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="mobileNo" className="font-bold">
            Mobile Number
          </label>
          <InputText
            id="mobileNo"
            value={product.mobileNo}
            onChange={e => onInputChange(e, "mobileNo")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.mobileNo
            })}
          />
          {submitted &&
            !product.mobileNo &&
            <small className="p-error">Mobile Number is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="shopName" className="font-bold">
            Shop Name
          </label>
          <InputText
            id="shopName"
            value={product.shopName}
            onChange={e => onInputChange(e, "shopName")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !product.shopName
            })}
          />
          {submitted &&
            !product.shopName &&
            <small className="p-error">Shop Name is required.</small>}
        </div>
        <div className="field">
          <label htmlFor="gstNo" className="font-bold">
            GST No
          </label>
          <InputText
            id="gstNo"
            value={product.gstNo}
            onChange={e => onInputChange(e, "gstNo")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.gstNo })}
          />
          {submitted &&
            !product.gstNo &&
            <small className="p-error">GST No is required.</small>}
        </div>

        {/* <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div> */}

        {/* <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div> */}
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product &&
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product &&
            <span>Are you sure you want to delete the selected products?</span>}
        </div>
      </Dialog>
    </div>
  );
}
