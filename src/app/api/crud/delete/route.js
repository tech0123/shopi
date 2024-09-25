import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Deleted from "@/lib/models/DeletedModel";
import Purchase from "@/lib/models/PurchaseModal";

export async function POST(request) {
  await connectToMongo();

  try {
    let modalToUse;

    const data = await request.json();

    const { modal_to_pass, id, start = 1, limit = 7, search = "" } = data;

    if (!modal_to_pass || !id) {
      return NextResponse.json(
        { success: false, error: "Type and ID are required" },
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
    } else if (modal_to_pass === "purchase") {
      modalToUse = Purchase;
    } else {
      return NextResponse.json(
        { err: 1, success: false, msg: "Invalid Modal" },
        { status: 400 }
      );
    }

    const entity = await modalToUse.findById(id);

    if (!entity) {
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
    await modalToUse.findByIdAndDelete(id);

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
        msg: `Delete ${modal_to_pass} successfully!`
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
