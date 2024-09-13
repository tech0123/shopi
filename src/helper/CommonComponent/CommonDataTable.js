'use client'
import React, { memo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { deleteItem } from "@/store/slice/commonSlice";
import CommonDeleteConfirmation from "./CommonDeleteConfirmation";
import { setAllProductList } from "@/store/slice/productItemSlice";

const CommonDataTable = (props) => {
  const dispatch = useDispatch();

  const {tableName, tableColumns, allItemList, handleAddItem, handleEditItem, handleDeleteItem, responsiveTableTemplete, deleteItemDialog,setDeleteItemDialog, selectedItemData, selectedItemName } = props

  const [globalFilter, setGlobalFilter] = useState(null);
 
  const hideProductDeleteDialog = () => {
    setDeleteItemDialog(false);
  };

  const deleteProduct = async () => {
    const payload = { modal_to_pass:"product", id: selectedItemData?._id };
    const res = await dispatch(deleteItem(payload))
    if(res){
      dispatch(setAllProductList(res))
      setDeleteItemDialog(false);
    }
  };

  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideProductDeleteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
    </>
  );

  const actionBodyTemplate = rowData => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => handleEditItem(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => handleDeleteItem(rowData)}
        />
      </>
    );
  };

  return (
    <div>
      <div className="my-5 me-5 d-flex justify-between">
        <div className="ml-5">
          <h4 className="text-white">{tableName}</h4>
        </div>

        <div className="d-flex gap-3">
          <div>
            <IconField iconPosition="left">
              <InputText
                type="search"
                placeholder="Search..."
                className="input_wrap"
                onInput={e => setGlobalFilter(e.target.value)}
              />
            </IconField>
          </div>
          <Button
            className="btn_primary"
            onClick={handleAddItem}
          >
            + Add
          </Button>
        </div>
      </div>

      <div className="table_wrapper">
        <DataTable
          value={allItemList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
        >
          {tableColumns?.map((column, i) => {
            return (
              <Column
                key={i}
                field={column?.field}
                header={column?.header}
                sortable
                style={{ minWidth: "12rem" }}
              />
            )
          })}
          <Column
            header="Action"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>

        <DataTable
          value={allItemList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
          className="mt-10 block xl:hidden"
        >
          <Column body={responsiveTableTemplete} style={{ minWidth: "12rem" }} />
        </DataTable>
      </div>

      <CommonDeleteConfirmation
        open={deleteItemDialog} 
        itemName={selectedItemName}
        hideContent={hideProductDeleteDialog} 
        footerContent={deleteProductDialogFooter} 
      />
    </div>
  );
};

export default memo(CommonDataTable);