import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    image: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_number: { type: String, required: true },
    type: { type: Number, required: true },
});

const Customer =
    mongoose.models.customers || mongoose.model("customers", CustomerSchema);

export default Customer;
