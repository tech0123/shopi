import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import Deleted from "@/lib/models/DeletedModel";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.json();
    // const file = data.get("file");
    const modalToPass = data.modal_to_pass;
    const _id = data._id;

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

    const existingDocument = await modalToUse.findById(_id);
    if (!existingDocument) {
      return NextResponse.json(
        { err: 1, success: false, msg: `${modalToPass} not found` },
        { status: 404 }
      );
    }

    const updateData = { ...data };
    // if (file) {
    //   const currentImage = existingDocument.image;

    //   const byteData = await file.arrayBuffer();
    //   const buffer = Buffer.from(byteData);
    //   const uniqueFileName = generateUniqueId();
    //   const path = `./public/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`;
    //   // const path = `./public${updateData?.image}`;  
    //   await writeFile(path, buffer);
    //   updateData.image = `/uploads/${uniqueFileName}.${file?.name?.split('.')?.pop()}`;
    //   // updateData.image = `${updateData?.image}`;
    //   if (currentImage) {
    //     await Deleted.create({
    //       imageId: currentImage,
    //     });
    //   }
    // }

    const updatedDocument = await modalToUse.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    const allData = await modalToUse.find();

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
