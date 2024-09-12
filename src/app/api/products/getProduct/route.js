import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectToMongo();
    try {

        const allProducts = await Product.find();

        return NextResponse.json({ result: allProducts, success: true }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
