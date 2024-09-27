import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const token = request.cookies.get("token"); // Assuming the token is stored in cookies
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        // Verify and decode the token
        const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);

        // Extract the _id from the decoded token
        const userId = decodedToken.id;

        return NextResponse.json({ userId }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
}
