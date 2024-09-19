import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";
import Manufacturer from "@/lib/models/ManufacturerModel";

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
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Modal provided" },
        { status: 400 }
      );
    }

    const data = await modalToUse.findById(id);

    if (!data) {
      return NextResponse.json(
        {
          err: 1,
          success: false,
          msg: `${modal_to_pass.charAt(0).toUpperCase() +
            modal_to_pass.slice(1)} not found`
        },
        { status: 404 }
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
