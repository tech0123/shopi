import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Attendance from "@/lib/models/AttendanceModel";

export async function POST(request) {
  await connectToMongo();

  try {
    let modalToUse;

    const { modal_to_pass, id } = await request.json();

    if (!id || !modal_to_pass) {
      return NextResponse.json(
        { success: false, error: "ID and Modal are required" },
        { status: 400 }
      );
    }

    if (modal_to_pass === "product") {
      modalToUse = Product;
    } else if (modal_to_pass === "customer") {
      modalToUse = Customer;
    } else if (modal_to_pass === "employee") {
      modalToUse = Employee;
    } else if (modal_to_pass === "manufacturer") {
      modalToUse = Manufacturer;
    } else if (modal_to_pass === "attendance") {
      modalToUse = Attendance;
    } else if (modal_to_pass === "purchase") {
      modalToUse = Purchase;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Modal provided" },
        { status: 400 }
      );
    }

    let data;
    if (modal_to_pass === "attendance") {
      data = await modalToUse.findOne({ employee_id: id });
    } else {
      data = await modalToUse.findById(id);

    }

    if (!data) {
      return NextResponse.json(
        {
          err: 1,
          success: false,
          msg: `${modal_to_pass.charAt(0).toUpperCase() +
            modal_to_pass.slice(1)} not found`
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: data || [],
        err: 0,
        success: true,
        msg: `Get ${modal_to_pass} successfully!`
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
