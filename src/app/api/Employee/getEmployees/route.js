import connectToMongo from "@/lib/db";
import { NextResponse } from "next/server";
import Employee from "@/lib/models/EmployeeModel";

export async function GET() {
  await connectToMongo();
  try {
    const employees = await Employee.find();

   if(employees?.length){
     return NextResponse.json(
       { data: employees, err: 0, msg: "Get Employees Succesfuly" },
       { status: 200 }
      );
    } else {
      return NextResponse.json(
        { data: [], err: 0, msg: "Get Employees Succesfuly" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { data:[], err: 1, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}
