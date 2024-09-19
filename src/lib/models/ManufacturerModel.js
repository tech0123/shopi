import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema({
  code: { type: String, required: true },
  full_name: { type: String, required: true },
  email_address: { type: String, required: true },
  mobile_number: { type: String, required: true },
  GST_no: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pin_code: { type: String, required: true },
  address: { type: String, required: true }
});

const Manufacturer =
  mongoose.models.addmanufacturer ||
  mongoose.model("addmanufacturer", ManufacturerSchema);

export default Manufacturer;
