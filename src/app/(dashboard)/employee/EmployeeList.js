"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tag } from "primereact/tag";
import { useDispatch, useSelector } from "react-redux";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { getEmployeeList } from "@/store/slice/employeeSlice";

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

let emptyProduct = {
  id: null,
  name: "",
  image: null,
  description: "",
  category: null,
  price: 0,
  quantity: 0,
  rating: 0,
  inventoryStatus: "INSTOCK"
};

export default function EmployeeList() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(emptyProduct);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  const { allEmployeeList } = useSelector(({ employee }) => employee);

  const fetchEmployeesData = async () => {
    if(!allEmployeeList?.length){
      dispatch(getEmployeeList());
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const editProduct = product => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = product => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const actionBodyTemplate = rowData => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="my-5 me-5 d-flex justify-between">
        <div className="ml-5">
          <h4 className="text-white">Employees</h4>
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
            onClick={() => router.push("/employee/add")}
          >
            + Add
          </Button>
        </div>
      </div>

      <div className="table_wrapper">
        <DataTable
          value={allEmployeeList}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
        >
          <Column
            field="email"
            header="Employee Email"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="role"
            header="Employee Role"
            style={{ minWidth: "16rem" }}
          />
          <Column
            header="Action"
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>
    </div>
  );
}
