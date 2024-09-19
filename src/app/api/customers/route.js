
import connectToMongo from "@/lib/db";
import Customer from "@/lib/models/CustomerModel";
import User from "@/lib/models/UserModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectToMongo();
    try {
        const { name, email, address, mobileNo, shopName, gstNo } = await request.json();

        if (!name || !email || address || !mobileNo || !shopName || !gstNo) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 500 });
        }

        const newUser = new Customer({ name, email, address, mobileNo, shopName, gstNo });
        const result = await newUser.save();
        return NextResponse.json({ result, success: true }, { status: 201 });

    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

