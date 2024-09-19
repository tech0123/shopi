import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    mobileNo: { type: String, required: true },
    shopName: { type: String, required: true },
    gstNo: { type: String, required: true },
});

const Customer = mongoose.models.customers || mongoose.model('customers', CustomerSchema);

export default Customer;