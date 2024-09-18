// import connectToMongo from "@/lib/db";
// import Product from "@/lib/models/ProductModel";
// import Customer from "@/lib/models/CustomerModel";
// import { NextResponse } from "next/server";
// import Employee from "@/lib/models/EmployeeModel";

// export async function POST(request) {
//   await connectToMongo();
//   try {
//     let modalToUse;
//     const { modal_to_pass, ...addData } = await request.json();

//     if (modal_to_pass === "product") {
//       modalToUse = Product;
//     } else if (modal_to_pass === "customer") {
//       modalToUse = Customer;
//     } else if (modal_to_pass === "employee") {
//       modalToUse = Employee;
//     } else {
//       return NextResponse.json(
//         { err: 1, success: false, msg: "Invalid Modal provided" },
//         { status: 400 }
//       );
//     }

//     const newUser = new modalToUse({ modal_to_pass, ...addData });
//     const result = await newUser.save();
//     const data = await modalToUse.find();

//     return NextResponse.json(
//       {
//         data: data || [],
//         err: 0,
//         success: true,
//         msg: `Add ${modal_to_pass} successfully!`
//       },
//       { status: 201 }
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
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { generateUniqueId } from "@/helper/commonValues";
import Manufacturer from "@/lib/models/ManufacturerModel";

export async function POST(request) {
  await connectToMongo();
  try {
    const data = await request.formData();
    const file = data.get("file"); // Retrieve file from formData
    const modalToPass = data.get("modal_to_pass"); // Retrieve modal_to_pass from formData

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
      const path = `./public/uploads/${uniqueFileName}`; // Save the file in public/uploads
      await writeFile(path, buffer);
      data.set("image", `/uploads/${uniqueFileName}`); // Set the image path in formData
    }

    const addData = Object.fromEntries(data.entries()); // Convert formData to object

    const newUser = await new modalToUse({ ...addData });
    const result = await newUser.save();

    const allData = await modalToUse.find(); // Fetch updated data

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
// import connectToMongo from "@/lib/db";
// import Product from "@/lib/models/ProductModel";
// import Customer from "@/lib/models/CustomerModel";
// import Employee from "@/lib/models/EmployeeModel";
// import { NextResponse } from "next/server";
// import { writeFile } from 'fs/promises';
// import path from 'path';

// export async function POST(request) {
//   await connectToMongo();
//   try {
//     const data = await request.formData();
//     const base64Image = data.get('image'); // Retrieve base64 image data
//     const modalToPass = data.get('modal_to_pass'); // Retrieve modal_to_pass from formData

//     let modalToUse;
//     if (modalToPass === "product") {
//       modalToUse = Product;
//     } else if (modalToPass === "customer") {
//       modalToUse = Customer;
//     } else if (modalToPass === "employee") {
//       modalToUse = Employee;
//     } else {
//       return NextResponse.json(
//         { err: 1, success: false, msg: "Invalid Model provided" },
//         { status: 400 }
//       );
//     }

//     // Handle base64 image if provided
//     let imagePath = null;
//     if (base64Image) {
//       const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
//       const buffer = Buffer.from(base64Data, 'base64');
//       const fileName = `image_${Date.now()}.png`; // Generate a unique file name
//       const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

//       // Ensure the directory exists
//       await writeFile(filePath, buffer);
//       imagePath = `/uploads/${fileName}`; // Path to the saved image
//     }

//     const addData = Object.fromEntries(data.entries()); // Convert formData to object
//     if (imagePath) {
//       addData.image = imagePath; // Add image path to the data
//     }
//     console.log(addData, "addData");

//     const newUser = await new modalToUse({ ...addData });
//     const result = await newUser.save();

//     const allData = await modalToUse.find(); // Fetch updated data
//     console.log(result, allData);

//     return NextResponse.json(
//       {
//         data: allData || [],
//         err: 0,
//         success: true,
//         msg: `Added ${modalToPass} successfully!`,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { err: 1, success: false, msg: error.message },
//       { status: 500 }
//     );
//   }
// }

// import { writeFile } from 'fs/promises';
// import connectToMongo from "@/lib/db";
// import Product from "@/lib/models/ProductModel";
// import Customer from "@/lib/models/CustomerModel";
// import Employee from "@/lib/models/EmployeeModel";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await connectToMongo();

//   try {
//     let imagePath = '';

//     // Handle file upload
//     const formData = await req.formData();
//     const file = formData.get('file');
//     if (file) {
//       const byteData = await file.arrayBuffer();
//       const buffer = Buffer.from(byteData);
//       imagePath = `./public/images/${file.name}`;
//       await writeFile(imagePath, buffer);
//     }

//     // Handle CRUD operations
//     const { modal_to_pass, ...addData } = await formData.get('data').json();
//     let modalToUse;

//     if (modal_to_pass === "product") {
//       modalToUse = Product;
//     } else if (modal_to_pass === "customer") {
//       modalToUse = Customer;
//     } else if (modal_to_pass === "employee") {
//       modalToUse = Employee;
//     } else {
//       return NextResponse.json(
//         { err: 1, success: false, msg: "Invalid Modal provided" },
//         { status: 400 }
//       );
//     }

//     const newEntry = new modalToUse({
//       ...addData,
//       image: file ? `/images/${file.name}` : addData.image
//     });

//     const result = await newEntry.save();
//     const dataFromDB = await modalToUse.find();

//     return NextResponse.json(
//       {
//         data: dataFromDB || [],
//         err: 0,
//         success: true,
//         msg: `Add ${modal_to_pass} successfully!`
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { err: 1, success: false, msg: error.message },
//       { status: 500 }
//     );
//   }
// }
