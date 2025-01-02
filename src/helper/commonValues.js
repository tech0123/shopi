import toast from "react-hot-toast";

export const linksOption = [
  { href: "/sales", text: "Sales" },
  { href: "/purchase", text: "Purchase" },
  { href: "/users", text: "Users" },
  { href: "/product", text: "Product" },
  { href: "/reports", text: "Reports" },
  // { href: "/company", text: "Company" },
  { href: "/customer", text: "Customer" },
  { href: "/employee", text: "Employee" },
  { href: "/manufacturer", text: "Manufacturer" },
  { href: "/attendance", text: "Employee Attendance" },
];

export const usersOption = [
  { href: "/customer", text: "New User" },
  { href: "/cart", text: "Existing User" },
];

export const calcInitialValues = {
  grandTotal: 0,
  discount: 0,
  tax: 0,
};

export const roastError = (e) => {
  toast.error("Something goes wrong, please try again later" + e);
};

export const successMsg = (e) => {
  toast.success(e);
};

export const errorMsg = (e) => {
  toast.error(e);
};

export const generateUniqueId = () => {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.random().toString(16).substr(2, 12);
  return timestamp + randomPart;
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const getFormattedDate = (value) => {
  const date = value ? new Date(value) : new Date();
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, "0");
  const day = date?.getDate()?.toString()?.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateTotal = (array, field) => {
  let calculatedValue = 0;

  if (array?.length && field) {
    calculatedValue = array.reduce((acc, crr) => {
      return acc + Number(crr[field]);
    }, 0);
  }
  return calculatedValue;
};

export const convertIntoNumber = (value) => {
  return parseFloat(Number(value).toFixed(2));
};

export const employeeRoleOptions = [
  { label: "Owner", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Sales-Men", value: 3 },
  { label: "C.A.", value: 4 },
  { label: "Godown", value: 5 },
];

export const customerTypeOptions = [
  { label: "Retail", value: 1 },
  { label: "Direct", value: 2 },
];

export const default_search_key = ["_id"];

export const product_search_key = ["name", "description", "selling_price"];

export const purchase_search_key = [
  "manufacturer_name",
  "bill_no",
  "gst_no",
  "mobile_number",
];

export const sales_search_key = [
  "customer_name",
  "email",
  "type",
  "mobile_number",
];

export const manufacturer_search_key = [
  "name",
  "email_address",
  "mobile_number",
  "gst_no",
];

export const employee_search_key = ["name", "email"];

export const customer_search_key = ["name", "email"];

export const attendance_search_key = ["name"];
