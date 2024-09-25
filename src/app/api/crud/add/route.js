import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Purchase from "@/lib/models/PurchaseModal";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.json();
    // const file = data.get("file");
    const { modal_to_pass, start = 1, limit = 7, search = '' } = data;

    let modalToUse;
    if (modal_to_pass === "product") {
      modalToUse = Product;
    } else if (modal_to_pass === "customer") {
      modalToUse = Customer;
    } else if (modal_to_pass === "employee") {
      modalToUse = Employee;
    } else if (modal_to_pass === "manufacturer") {
      modalToUse = Manufacturer;
    } else if (modal_to_pass === "purchase") {
      modalToUse = Purchase;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Model provided" },
        { status: 400 }
      );
    }

    // Handle file upload if a file is provided
    // if (file) {
    //   const byteData = await file.arrayBuffer();
    //   const buffer = Buffer.from(byteData);
    //   const uniqueFileName = generateUniqueId();
    //   const path = `./public/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`;
    //   await writeFile(path, buffer);
    //   data.set("image", `/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`);
    // }

    const addData = { ...data };

    const newUser = await new modalToUse(addData);
    const result = await newUser.save();

    const query = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } }, // Case insensitive search in name
          { description: { $regex: search, $options: "i" } } // Case insensitive search in description
        ]
      }
      : {};

    const totalRecords = await modalToUse.countDocuments(query);
    const skip = (start - 1) * limit;
    const paginatedData = await modalToUse.find(query).skip(skip).limit(limit);
    return NextResponse.json(
      {
        data: {
          list: paginatedData || [],
          totalRows: totalRecords,
          pageNo: start
        },
        err: 0,
        success: true,
        msg: `Added ${modalToPass === 'purchase' ? 'bill' : modalToPass} successfully!`
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
