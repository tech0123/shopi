
import connectToMongo from "@/lib/db";
import User from "@/lib/models/UserModel";
import { NextResponse } from 'next/server';

connectToMongo();

export async function POST(request) {
    try {
        const payload = await request.json();
        console.log('Received payload:', payload);

        // Ensure email and password exist
        if (!payload.email || !payload.password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        const user = new User(payload);
        const result = await user.save();

        console.log('Saved user:', result);

        return NextResponse.json({ result, success: true });
    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

