import { NextResponse } from "next/server";

export async function POST(request) {
    await connectToMongo();
    try {
        const response = NextResponse.json({ message: "Logged Out Successfully!", success: true }, { status: 200 });

        response.cookies.set("token", "", {
            httpOnly: true
        })

        return response

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}