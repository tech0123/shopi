import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import { NextResponse } from 'next/server';

// Assuming you are using dynamic routing and want to get a single product by its ID
export async function GET(request) {
    await connectToMongo();

    // Get the product ID from the request URL (assuming you're using Next.js dynamic routes)
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop(); // Extract productId from URL

    try {
        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product, success: true }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
