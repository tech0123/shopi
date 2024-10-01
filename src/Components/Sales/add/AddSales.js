import CommonAddEditSales from "../CommonAddEditSales";

const initialSalesValue = {
    customer_name: "",
    customer: "",
    sales_date: "",
    bill_no: "",
    mobile_number: "",
    address: "",
    sales_record_table: [],
    sub_total: 0,
    discount: 0,
    tax: 0,
    total_amount: 0
  };

const AddSales = () => {
  return (
    <>
      <CommonAddEditSales initialValue={initialSalesValue}/>
    </>
  );
};

export default AddSales;
