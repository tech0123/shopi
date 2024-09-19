import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  available_quantity: { type: String, required: true },
  discount: { type: String, required: true },
  tax: { type: String, required: true },
  selling_price: { type: String, required: true },
  cost_price: { type: String, required: true }
});

const Product =
  mongoose.models.products || mongoose.model("products", ProductSchema);

export default Product;
