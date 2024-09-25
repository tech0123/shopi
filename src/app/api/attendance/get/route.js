import connectToMongo from "@/lib/db";
import Attendance from "@/lib/models/AttendanceModel";
import { NextResponse } from "next/server";


export async function POST(request) {
  await connectToMongo();
  try {
    let data = [];



    data = await Attendance.find();

    return NextResponse.json(
      {
        data: data || [],
        err: 0,
        success: true,
        msg: `Get Attendance Succesfuly`
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
