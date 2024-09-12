import { NextResponse } from "next/server";

export async function GET(request) { }

export async function HEAD(request) { }

export async function POST(request) {
    try {
        let data = await request.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PUT(request) { }

export async function DELETE(request) { }

export async function PATCH(request) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) { }