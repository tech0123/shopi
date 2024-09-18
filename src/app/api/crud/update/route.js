// import connectToMongo from "@/lib/db";
// import Product from "@/lib/models/ProductModel";
// import Customer from "@/lib/models/CustomerModel"; // Assuming you have a Customer model
// import { NextResponse } from "next/server";
// import Employee from "@/lib/models/EmployeeModel";

// export async function POST(request) {
//   await connectToMongo();

//   try {
//     let modalToUse;
//     const { modal_to_pass, _id, ...rest } = await request.json();

//     if (!modal_to_pass || !_id) {
//       return NextResponse.json(
//         { err: 1, success: false, msg: "Type and ID are required" },
//         { status: 400 }
//       );
//     }

//     if (modal_to_pass === "product") {
//       modalToUse = Product;
//     } else if (modal_to_pass === "customer") {
//       modalToUse = Customer;
//     } else if (modal_to_pass === "employee") {
//       modalToUse = Employee;
//     } else {
//       return NextResponse.json(
//         { err: 1, success: false, msg: "Invalid Modal" },
//         { status: 400 }
//       );
//     }

//     const updatedDocument = await modalToUse.findByIdAndUpdate(
//       _id,
//       { $set: rest },
//       { new: true }
//     );

//     const data = await modalToUse.find();

//     return NextResponse.json(
//       {
//         data: data || [],
//         err: 0,
//         success: true,
//         msg: `update ${modal_to_pass} successfully!`
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { err: 1, success: false, msg: error.message },
//       { status: 500 }
//     );
//   }
// }
import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.formData();
    const file = data.get("file"); // Retrieve file from formData
    const modalToPass = data.get("modal_to_pass"); // Retrieve modal_to_pass from formData
    const _id = data.get("_id"); // Retrieve the ID from formData

    if (!modalToPass || !_id) {
      return NextResponse.json(
        { err: 1, success: false, msg: "Type and ID are required" },
        { status: 400 }
      );
    }

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
        { err: 1, success: false, msg: "Invalid Model" },
        { status: 400 }
      );
    }

    const updateData = Object.fromEntries(data.entries());
    if (file) {
      const byteData = await file.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const uniqueFileName = generateUniqueId();
      const path = `./public/uploads/${uniqueFileName}`;
      await writeFile(path, buffer);
      updateData.image = `/uploads/${uniqueFileName}`;
    }

    const updatedDocument = await modalToUse.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    const allData = await modalToUse.find(); // Fetch updated data

    return NextResponse.json(
      {
        data: allData || [],
        err: 0,
        success: true,
        msg: `Updated ${modalToPass} successfully!`
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
