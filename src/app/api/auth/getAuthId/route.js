import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        
        const token = request.cookies.get('token')?.value;

        if (!token) {
            console.log('Token not found');
            return NextResponse.json({ error: "Token not found" }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!decoded) {
            console.log('Invalid token');
            return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
        }

        const userId = decoded.id;

        return NextResponse.json({ message: "User ID extracted", userId }, { status: 200 });
        
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
