import connectToMongo from "@/lib/db";
import { NextResponse } from "next/server";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Attendance from "@/lib/models/AttendanceModel";
import Purchase from "@/lib/models/PurchaseModal";

export async function POST(request) {
  await connectToMongo();
  try {
    let modalToUse;
    let data = [];
    const modifyProducts = (data) => {
      return [...(data || [])]?.map((d) => {
        // d.date = new Date(d.date);
        d.qty = 0;
        d.discount = 0;
        d.amount = 0;
        return d;
      });
    };
    const { modal_to_pass, start = 1,
      limit = 7, search = '', search_key = []
    } = await request.json();

    if (modal_to_pass === "Customers") {
      modalToUse = Customer;
    } else if (modal_to_pass === "Products") {
      modalToUse = Product;
    } else if (modal_to_pass === "Employees") {
      modalToUse = Employee;
    } else if (modal_to_pass === "Manufacturers") {
      modalToUse = Manufacturer;
    } else if (modal_to_pass === "Purchase") {
      modalToUse = Purchase;
    } else if (modal_to_pass === "Attendance") {
      modalToUse = Attendance;
    } else {
      return NextResponse.json(
        { data: [], err: 1, success: false, msg: "Invalid Modal" + error.message, },
        { status: 400 }
      );
    }



    if (search_key.length === 0) {
      return NextResponse.json(
        { data: [], err: 1, success: false, msg: "Please send search key" },
        { status: 400 }
      );
    }
    const query = search && search_key.length > 0
      ? {
        $or: search_key.map(item => ({
          [item]: { $regex: search, $options: "i" }
        }))
      }
      : {};


    const totalRecords = await modalToUse.countDocuments(query);

    const skip = (start - 1) * limit;

    data = await modalToUse.find(query).skip(skip).limit(limit).lean();


    const modifyProduct = await modifyProducts(data)

    return NextResponse.json(
      {
        status: 200,
        err: 0,
        data: {
          list: modal_to_pass === "Products" ? modifyProduct : data || [],
          totalRows: totalRecords,
          pageNo: start
        },
        msg: `Get ${modal_to_pass} Successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
