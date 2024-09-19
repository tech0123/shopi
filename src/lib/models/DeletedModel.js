import mongoose from "mongoose";

const DeletedSchema = new mongoose.Schema({
    imageId: { type: String, required: true },
});

const Deleted =
    mongoose.models.deletedimage || mongoose.model("deletedimage", DeletedSchema);

export default Deleted;
