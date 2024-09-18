'use client'
import React, { memo } from "react";
import { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import CommonDeleteConfirmation from "./CommonDeleteConfirmation";

const CommonDataTable = (props) => {
  const {
    tableName, 
    tableColumns, 
    allItemList, 
    handleAddItem, 
    handleEditItem, 
    handleDeleteItem, 
    responsiveTableTemplete, 
    deleteItemDialog,
    hideDeleteDialog,
    deleteItem,
  } = props

  const [globalFilter, setGlobalFilter] = useState(null);

  const deleteProductDialogFooter = (
    <div className="d-flex justify-end gap-4">
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteItem}
      />
    </div>
  );

  const actionBodyTemplate = rowData => {
    return (
      <div>
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
      </div>
    );
  };

  return (
    <>
      <div className="m-5 d-flex justify-between">
        <h4 className="text-white">{tableName}</h4>
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
                body={column?.body}
                sortable
                style={{ minWidth: "12rem" }}
                className=""
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
        hideContent={hideDeleteDialog} 
        footerContent={deleteProductDialogFooter} 
      />
    </>
  );
};

export default memo(CommonDataTable);