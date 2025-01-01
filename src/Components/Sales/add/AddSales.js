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
  total_amount: 0,
};

const AddSales = () => {
  return (
    <>
      <div className="container-fluid m-0 p-0 overflow-hidden main_modal_area">
        <div className="p-2 modal__gap">
          <CommonAddEditSales initialValue={initialSalesValue} />
        </div>
      </div>
    </>
  );
};

export default AddSales;
