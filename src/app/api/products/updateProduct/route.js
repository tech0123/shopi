
import connectToMongo from "@/lib/db";
import Product from "@/lib/models/ProductModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectToMongo();
    try {
        const { name, description, available_quantity, discount, tax, selling_price, cost_price } = await request.json();

        if (!name || !description || !available_quantity || !discount || !tax || !selling_price || !cost_price) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 500 });
        }

        const newUser = new Product({ name, description, available_quantity, discount, tax, selling_price, cost_price });
        const result = await newUser.save();
        return NextResponse.json({ result, success: true }, { status: 201 });

    } catch (error) {
        console.error('Error processing request:', error.message);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// router.post('/edit/:id', async(req, res) => {
//     try {
//         const {s_name, marks, result} = req.body;
//         const crud = await Crud.findByIdAndUpdate(req.params.id, {s_name, marks, result});
//         res.status(200).json({message: "Crud updated successfully", crud});
//     } catch (error) {
//         res.status(500).json({message: "Internal server error", error});
//     }
// })
