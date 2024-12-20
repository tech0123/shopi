import User from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import connectToMongo from "@/lib/db";

export async function POST(request) {
    await connectToMongo();

    function encodeRole(role) {
        return Buffer.from(role).toString('base64');
    }

    console.log('==============================@@@@@@@@@@@@@@@@@@@@@@@@@-===============================')
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        const user = await User.findOne({ email });

        console.log('reqBody', reqBody)

        if (!user) {
            return NextResponse.json({ error: "User Doesn't Exists", success: false }, { status: 400 });
        }

        const validPassword = await bcryptjs.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: "User Password Doesn't Exists", success: false }, { status: 400 });
        }

        if (!user.role) {
            return NextResponse.json({ error: "User role not found", success: false }, { status: 400 });
        }

        const tokenData = { id: user._id }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET)
        const response = NextResponse.json({ message: "Logged in Successfully!", success: true }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true
        })

        const encodedRole = await encodeRole(user.role);
        response.cookies.set("role", encodedRole, {
            httpOnly: true
        })

        return response

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}