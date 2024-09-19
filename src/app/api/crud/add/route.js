import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.formData();
    const file = data.get("file");
    const modalToPass = data.get("modal_to_pass");

    let modalToUse;
    if (modalToPass === "product") {
      modalToUse = Product;
    } else if (modalToPass === "customer") {
      modalToUse = Customer;
    } else if (modalToPass === "employee") {
      modalToUse = Employee;
    } else if (modalToPass === "manufacturer") {
      modalToUse = Manufacturer;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Model provided" },
        { status: 400 }
      );
    }

    // Handle file upload if a file is provided
    if (file) {
      const byteData = await file.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const uniqueFileName = generateUniqueId();
      const path = `./public/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`;
      await writeFile(path, buffer);
      data.set("image", `/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`);
    }

    const addData = Object.fromEntries(data.entries());

    const newUser = await new modalToUse({ ...addData });
    const result = await newUser.save();

    const allData = await modalToUse.find();

    return NextResponse.json(
      {
        data: allData || [],
        err: 0,
        success: true,
        msg: `Added ${modalToPass} successfully!`
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
