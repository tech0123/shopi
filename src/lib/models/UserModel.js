import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Please Provide Email"] },
    password: { type: String, required: [true, "Please Provide Password"] },
    role: { type: String },
});

const User = mongoose.models.dbusers || mongoose.model('dbusers', UserSchema);

export default User;