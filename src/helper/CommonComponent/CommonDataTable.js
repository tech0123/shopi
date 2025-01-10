"use client";
import React, { memo, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import CommonDeleteConfirmation from "./CommonDeleteConfirmation";
import CustomPaginator from "./CustomPaginator";
import { Image } from "react-bootstrap";
import { Dialog } from "primereact/dialog";

const CommonDataTable = (props) => {
  const {
    tableName,
    tableColumns,
    allItemList,
    handleChangeSearch,
    searchParam,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    responsiveTableTemplete,
    deleteItemDialog,
    hideDeleteDialog,
    deleteItem,
    pageLimit,
    onPageChange,
    onPageRowsChange,
    currentPage,
    isDisable = true,
  } = props;
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialog, setImageDialog] = useState(false);

  const [globalFilter, setGlobalFilter] = useState(null);
  const handleImageClick = (rowData) => {
    setSelectedImage(rowData.image); // Store the image of the clicked row
    setImageDialog(true); // Open the dialog
  };

  const deleteProductDialogFooter = (
    <div className="d-flex justify-content-end gap-4">
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => handleEditItem(rowData?._id)}
        />
        {isDisable && (
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            onClick={() => handleDeleteItem(rowData)}
          />
        )}
      </div>
    );
  };
  return (
    <>
      <div className="d-flex justify-between align-items-center header_title">
        <div className="text-white header_logo m-0">{tableName}</div>
        <div className="d-flex  search-partition">
          <div>
            <IconField iconPosition="left">
              <InputText
                id="search"
                placeholder="Search"
                type="search"
                className="input_wrap small search_wrap search_input"
                value={searchParam}
                onChange={handleChangeSearch}
              />
            </IconField>
          </div>
          {isDisable && (
            <Button
              className="btn_primary add_btn gradient_common_btn"
              onClick={handleAddItem}
            >
              + Add
            </Button>
          )}
        </div>
      </div>

      {/* <div className=""> */}
      <div className="table_wrapper ">
        <DataTable
          value={allItemList?.list}
          dataKey="id"
          // paginator
          rows={7}
          // rowsPerPageOptions={[5, 10, 25]}
          // totalRecords={totalRecords}
          // onPage={onPageChange}
          globalFilter={globalFilter}
          className="max-xl:hidden"
        >
          {tableColumns?.map((column, i) => {
            console.log(column, "column");
            return (
              <Column
                key={i}
                field={column?.field}
                header={column?.header}
                body={(rowData) =>
                  column?.field === "image" ? (
                    // Only the "image" column is clickable
                    <div
                      onClick={() => handleImageClick(rowData)} // Open the image dialog when clicked
                      style={{ cursor: "pointer" }}
                    >
                      <Image
                        src={rowData?.image || ""}
                        alt={rowData?._id || "Image not found"}
                        className="shadow-2 border-round table_img object-cover transition duration-300 ease-in-out hover:scale-110"
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    // For other columns, just display the data
                    <span>{rowData[column?.field]}</span>
                  )
                }
                sortable
                style={{ minWidth: "12rem" }}
                className={
                  column?.field === "image"
                    ? "addd max-xl:hidden"
                    : "max-xl:hidden"
                }
              />
            );
          })}
          <Column
            header="Action"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
            className="max-lg:hidden"
          />
        </DataTable>
        <DataTable
          value={allItemList?.list}
          dataKey="id"
          // paginator
          rows={7}
          // rowsPerPageOptions={[5, 10, 25]}
          // totalRecords={totalRecords}
          // onPage={onPageChange}
          globalFilter={globalFilter}
          className="mt-10 block xl:hidden"
        >
          <Column
            body={responsiveTableTemplete}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
        <CustomPaginator
          dataList={allItemList?.list}
          pageLimit={pageLimit}
          onPageChange={onPageChange}
          onPageRowsChange={onPageRowsChange}
          currentPage={currentPage}
          totalCount={allItemList?.totalRows}
        />
      </div>
      <Dialog
        visible={imageDialog}
        onHide={() => setImageDialog(false)} // Close the dialog
        // header="Image"
        style={{ width: "100%", height: "100%" }} // Adjust the size as needed
        className="image_modal"
      >
        <Image
          src={selectedImage}
          alt="Selected Image"
          className="shadow-2 border-round w-100 h-100 object-fit-cover"
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      </Dialog>
      <CommonDeleteConfirmation
        open={deleteItemDialog}
        hideContent={hideDeleteDialog}
        footerContent={deleteProductDialogFooter}
      />
    </>
  );
};

export default memo(CommonDataTable);
