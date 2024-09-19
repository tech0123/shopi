import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectToMongo();
  try {
    const data = await Product.find();

    return NextResponse.json(
      { data, err: 0, msg: "Get All Products Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
