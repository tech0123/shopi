import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel"; // Assuming you have a Customer model
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";

export async function POST(request) {
  await connectToMongo();

  try {
    let modalToUse;
    const { modal_to_pass, _id, ...rest } = await request.json();

    if (!modal_to_pass || !_id) {
      return NextResponse.json(
        { err: 1, success: false, msg: "Type and ID are required" },
        { status: 400 }
      );
    }

    if (modal_to_pass === "product") {
      modalToUse = Product;
    } else if (modal_to_pass === "customer") {
      modalToUse = Customer;
    } else if (modal_to_pass === "employee") {
      modalToUse = Employee;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Modal" },
        { status: 400 }
      );
    }

    const updatedDocument = await modalToUse.findByIdAndUpdate(
      _id,
      { $set: rest },
      { new: true }
    );

    const data = await modalToUse.find();

    return NextResponse.json(
      {
        data: data || [],
        err: 0,
        success: true,
        msg: `update ${modal_to_pass} successfully!`
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
