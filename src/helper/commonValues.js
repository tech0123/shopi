import toast from "react-hot-toast";

export const linksOption = [
  { href: "/sales", text: "Sales" },
  { href: "/purchase", text: "Purchase" },
  { href: "/users", text: "Users" },
  { href: "/product", text: "Product" },
  { href: "/reports", text: "Reports" },
  { href: "/company", text: "Company" },
  { href: "/employee", text: "Employee" },
  { href: "/manufacturer", text: "Manufacturer" },
  { href: "/attendance", text: "Employee Attendance" }
];


export const usersOption = [
  { href: "/customer", text: "New User" },
  { href: "/cart", text: "Existing User" }
];

export const calcInitialValues = {
  grandTotal: 0,
  discount: 0,
  tax: 0
};

export const roastError = e => {
  toast.error("Something goes wrong, please try again later");
};

export const successMsg = e => {
  toast.success(e);
};

export const errorMsg = e => {
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

export const getFormattedDate = value => {
  const date = value ? new Date(value) : new Date();
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1)?.toString()?.padStart(2, '0');
  const day = date?.getDate()?.toString()?.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateTotal = (array, field) => {
  let calculatedValue = 0;
  
  if(array?.length && field){
    calculatedValue = array.reduce((acc, crr) => {
      return acc + Number(crr[field])
    }, 0)
  }
  return calculatedValue;
}

export const convertIntoNumber = value => {
  return parseFloat(Number(value).toFixed(2));
};






export const sampleUser = [
  {
    id: "1",
    name: "Laptop",
    email: "laptop@example.com",
    address: "123 Main St, Cityville",
    mobileNo: "123-456-7890",
    shopName: "Tech Store",
    gstNo: "GST123456",
    category: "Electronics",
    price: 999.99,
    available_quantity: 20,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "laptop.jpg"
  },
  {
    id: "2",
    name: "Smartphone",
    email: "phone@example.com",
    address: "456 Elm St, Townsville",
    mobileNo: "234-567-8901",
    shopName: "Mobile Hub",
    gstNo: "GST234567",
    category: "Electronics",
    price: 699.99,
    available_quantity: 50,
    rating: 5,
    inventoryStatus: "INSTOCK",
    image: "smartphone.jpg"
  },
  {
    id: "3",
    name: "Headphones",
    email: "headphones@example.com",
    address: "789 Oak St, Villagetown",
    mobileNo: "345-678-9012",
    shopName: "Audio World",
    gstNo: "GST345678",
    category: "Accessories",
    price: 199.99,
    available_quantity: 30,
    rating: 4,
    inventoryStatus: "LOWSTOCK",
    image: "headphones.jpg"
  },
  {
    id: "4",
    name: "Smartwatch",
    email: "watch@example.com",
    address: "101 Pine St, Hamlet",
    mobileNo: "456-789-0123",
    shopName: "Gadget Central",
    gstNo: "GST456789",
    category: "Electronics",
    price: 299.99,
    available_quantity: 15,
    rating: 4,
    inventoryStatus: "OUTOFSTOCK",
    image: "smartwatch.jpg"
  },
  {
    id: "5",
    name: "Tablet",
    email: "tablet@example.com",
    address: "202 Maple St, Metropolis",
    mobileNo: "567-890-1234",
    shopName: "Gizmo Store",
    gstNo: "GST567890",
    category: "Electronics",
    price: 499.99,
    available_quantity: 25,
    rating: 3,
    inventoryStatus: "INSTOCK",
    image: "tablet.jpg"
  },
  {
    id: "6",
    name: "Camera",
    email: "camera@example.com",
    address: "303 Birch St, Urbania",
    mobileNo: "678-901-2345",
    shopName: "Shutter Shop",
    gstNo: "GST678901",
    category: "Electronics",
    price: 899.99,
    available_quantity: 10,
    rating: 5,
    inventoryStatus: "LOWSTOCK",
    image: "camera.jpg"
  },
  {
    id: "7",
    name: "Fitness Tracker",
    email: "fittrack@example.com",
    address: "404 Cedar St, Suburbia",
    mobileNo: "789-012-3456",
    shopName: "Fit Gear",
    gstNo: "GST789012",
    category: "Fitness",
    price: 149.99,
    available_quantity: 40,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "fitnesstracker.jpg"
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    email: "speaker@example.com",
    address: "505 Spruce St, Riverside",
    mobileNo: "890-123-4567",
    shopName: "Sound Shop",
    gstNo: "GST890123",
    category: "Accessories",
    price: 99.99,
    available_quantity: 35,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "speaker.jpg"
  },
  {
    id: "9",
    name: "Gaming Console",
    email: "console@example.com",
    address: "606 Walnut St, Bayside",
    mobileNo: "901-234-5678",
    shopName: "Game Zone",
    gstNo: "GST901234",
    category: "Electronics",
    price: 499.99,
    available_quantity: 10,
    rating: 5,
    inventoryStatus: "OUTOFSTOCK",
    image: "console.jpg"
  },
  {
    id: "10",
    name: "VR Headset",
    email: "vr@example.com",
    address: "707 Chestnut St, Lakeview",
    mobileNo: "012-345-6789",
    shopName: "Virtual World",
    gstNo: "GST012345",
    category: "Electronics",
    price: 399.99,
    available_quantity: 15,
    rating: 5,
    inventoryStatus: "LOWSTOCK",
    image: "vr.jpg"
  },
  {
    id: "11",
    name: "Laptop Bag",
    email: "bag@example.com",
    address: "808 Fir St, Mountainview",
    mobileNo: "123-456-7890",
    shopName: "Bag Depot",
    gstNo: "GST123456",
    category: "Accessories",
    price: 49.99,
    available_quantity: 50,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "laptopbag.jpg"
  },
  {
    id: "12",
    name: "Wireless Mouse",
    email: "mouse@example.com",
    address: "909 Redwood St, Valley",
    mobileNo: "234-567-8901",
    shopName: "Tech Essentials",
    gstNo: "GST234567",
    category: "Accessories",
    price: 29.99,
    available_quantity: 100,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "mouse.jpg"
  },
  {
    id: "13",
    name: "Keyboard",
    email: "keyboard@example.com",
    address: "1010 Ash St, Forestview",
    mobileNo: "345-678-9012",
    shopName: "Peripheral Palace",
    gstNo: "GST345678",
    category: "Accessories",
    price: 59.99,
    available_quantity: 70,
    rating: 3,
    inventoryStatus: "INSTOCK",
    image: "keyboard.jpg"
  },
  {
    id: "14",
    name: "Monitor",
    email: "monitor@example.com",
    address: "1111 Cypress St, Seaview",
    mobileNo: "456-789-0123",
    shopName: "Display Center",
    gstNo: "GST456789",
    category: "Electronics",
    price: 299.99,
    available_quantity: 25,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "monitor.jpg"
  },
  {
    id: "15",
    name: "Webcam",
    email: "webcam@example.com",
    address: "1212 Dogwood St, Hilltop",
    mobileNo: "567-890-1234",
    shopName: "Camera Corner",
    gstNo: "GST567890",
    category: "Electronics",
    price: 79.99,
    available_quantity: 45,
    rating: 4,
    inventoryStatus: "INSTOCK",
    image: "webcam.jpg"
  }
];

