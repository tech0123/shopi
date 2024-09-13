import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";

export async function POST(request) {
  await connectToMongo();
  try {
    let modalToUse;
    const { modal_to_pass, ...addData } = await request.json();

    if (modal_to_pass === "product") {
      modalToUse = Product;
    } else if (modal_to_pass === "customer") {
      modalToUse = Customer;
    } else if (modal_to_pass === "employee") {
      modalToUse = Employee;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Modal provided" },
        { status: 400 }
      );
    }

    const newUser = new modalToUse({ modal_to_pass, ...addData });
    const result = await newUser.save();
    const data = await modalToUse.find();

    return NextResponse.json(
      {
        data: data || [],
        err: 0,
        success: true,
        msg: `Add ${modal_to_pass} successfully!`
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
