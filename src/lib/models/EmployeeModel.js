import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

const Employee =
  mongoose.models.addemployee || mongoose.model("addemployee", EmployeeSchema);

export default Employee;
