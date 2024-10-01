import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Purchase from "@/lib/models/PurchaseModal";
import Sales from "@/lib/models/SalesModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.json();
    // const file = data.get("file");
    const { modal_to_pass, start = 1, limit = 7, search = '', search_key = [] } = data;

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
    } else if (modal_to_pass === "sales") {
      modalToUse = Sales;
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

    if (modal_to_pass === "purchase" && data?.purchase_record_table?.length) {
      const updatePromises = data?.purchase_record_table?.map(async (product) => {
        const { _id, quantity, ...restField } = product;

        let existingProduct = await Product.findById(_id);
        if (!existingProduct) {
          throw new Error(`Product with ID ${_id} not found`);
        }

        existingProduct = {
          ...existingProduct._doc,
          ...restField,
          available_quantity: parseInt(existingProduct?.available_quantity) + parseInt(quantity)
        };

        await Product.findByIdAndUpdate(
          _id,
          { $set: existingProduct },
          { new: true }
        );
      });

      await Promise.all(updatePromises);
    }

    const addData = { ...data };

    const newUser = await new modalToUse(addData);
    const result = await newUser.save();

    if (search_key?.length === 0) {
      return NextResponse.json(
        { data: [], err: 1, success: false, msg: "Please send search key" },
        { status: 400 }
      );
    }
    const query = search && search_key?.length > 0
      ? {
        $or: search_key?.map(item => ({
          [item]: { $regex: search, $options: "i" }
        }))
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
        msg: `Added ${modal_to_pass === "purchase"
          ? "bill"
          : modal_to_pass} successfully!`
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
