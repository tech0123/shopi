import connectToMongo from "@/lib/db";
import User from "@/lib/models/UserModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToMongo();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 500 }
      );
    }

    const newUser = new User({ email, password });
    const result = await newUser.save();
    return NextResponse.json({ result, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
