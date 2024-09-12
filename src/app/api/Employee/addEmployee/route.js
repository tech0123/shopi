import connectToMongo from "@/lib/db";
import Employee from "@/lib/models/EmployeeModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToMongo();
  try {
    const { email, password, role, company_name } = await request.json();

    if (!email || !password || !role || !company_name) {
      return NextResponse.json(
        { data: {}, err: 1, msg: "Some fields are required" },
        { status: 500 }
      );
    } else {
      const newEmployee = new Employee(request);
      const result = await newEmployee.save();

      console.log("result", result);

      return NextResponse.json(
        { data: result, err: 0, msg: "Add Employee Succesfuly" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ err: 1, msg: error.message }, { status: 500 });
  }
}
