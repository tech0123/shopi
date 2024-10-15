import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import Customer from "@/lib/models/CustomerModel";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";
import Manufacturer from "@/lib/models/ManufacturerModel";
import Attendance from "@/lib/models/AttendanceModel";
import Purchase from "@/lib/models/PurchaseModal";
import Sales from "@/lib/models/SalesModel";

export async function POST(request) {
  await connectToMongo();

  try {

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    let data;

    data = await Attendance.findById(id);

    if (!data) {
      return NextResponse.json(
        {
          err: 1,
          success: false,
          msg: "Attendance not found"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: data || [],
        err: 0,
        success: true,
        msg: "Get Attendance successfully!"
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
