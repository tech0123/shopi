'use client';
import React, { memo, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import CustomPaginator from "@/helper/CommonComponent/CustomPaginator";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerReportData } from "@/store/slice/reportSlice";

const CustomerReport = () => {
  const dispatch = useDispatch()

  const { customerReportData } = useSelector(({ report }) => report)

    const fetchCustomerReportData = async (
      start = 1, 
      limit = 7, 
      search = ""
    ) => {
      const payload = {
        start: start,
        limit: limit,
        search: search?.trim(),
      }
      dispatch(getCustomerReportData(payload))
    }

    useEffect(() => {
      fetchCustomerReportData()
    },[])

    return (
    <>
        <div className="table_main_Wrapper h-auto overflow-hidden">
        <div className="top_filter_wrap">
          <Row className="justify-content-between g-2 align-items-center">
            <Col sm={6}>
              <div className="page_title">
                <h3 className="m-0">Top Customers</h3>
              </div>
            </Col>
          </Row>
        </div>
        <div className="table_wrapper max_height customer_table">
          <DataTable
            value={[]}
            sortField="price"
            sortOrder={1}
            rows={10}
          >
            <Column
              field="employee_name"
              header="Employee name"
              sortable
            ></Column>
            <Column field="emp_no" header="ID" sortable></Column>
            <Column
              field="total_project"
              header="Project Assignees"
              sortable
            ></Column>
            <Column
              field="pending_project"
              header="Project Pending"
              sortable
            ></Column>
            <Column
              field="completed_project"
              header="Project  Completed"
              sortable
            ></Column>
            <Column field="due_date" header="Next Due Date" sortable></Column>
          </DataTable>
          <CustomPaginator
            // dataList={[]}
            // pageLimit={0}
            // onPageChange={}
            // onPageRowsChange={onPageRowsChange}
            // currentPage={currentPage}
            // totalCount={allItemList?.totalRows}
          />
        </div>
      </div>
    </>
    );
};

export default memo(CustomerReport);
