import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import Employee from "@/lib/models/EmployeeModel";
import { NextResponse } from "next/server";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Purchase from "@/lib/models/PurchaseModal";
import Sales from "@/lib/models/SalesModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.json();
    // const file = data.get("file");.
    const { modal_to_pass, _id, start = 1, limit = 7, search = '', search_key = [] } = data;

    if (!modal_to_pass || !_id) {
      return NextResponse.json(
        { err: 1, success: false, msg: "Type and ID are required" },
        { status: 400 }
      );
    }

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
        { err: 1, success: false, msg: "Invalid Model" },
        { status: 400 }
      );
    }

    const existingDocument = await modalToUse.findById(_id);
    if (!existingDocument) {
      return NextResponse.json(
        { err: 1, success: false, msg: `${modal_to_pass} not found` },
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


    const updatedDocument = await modalToUse.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

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
        msg: `Updated ${modal_to_pass} successfully!`
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
