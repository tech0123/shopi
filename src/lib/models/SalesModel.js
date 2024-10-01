import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: [true, "Customer is required."]
  },
  customer_name: { type: String },
  sales_date: {
    type: String,
    required: [true, "Sales date is required."]
  },
  bill_no: {
    type: String,
    required: [true, "Bill no. is required."]
  },
  email: {
    type: String,
    required: [true, "Email is required."]
  },
  mobile_number: {
    type: String,
    required: [true, "Mobile number is required."],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Simple mobile number validation for 10 digits
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  type: {
    type: String,
    required: [true, "Customer Type is required."]
  },
  address: {
    type: String,
    required: [true, "Customer Address is required."]
  },
  sales_record_table: [
    {
      product: {
        type: String,
        required: [true, "Product name is required."]
      },
      product_name: { type: String },
      quantity: {
        type: String,
        required: [true, "Quantity is required."]
      },
      selling_price: {
        type: String,
        required: [true, "Selling price is required."]
      },
      cost_price: {
        type: String,
        required: [true, "Cost price is required."]
      },
      tax: {
        type: String,
        required: [true, "Tax is required."]
      },
      description: { type: String }
    }
  ],
  sub_total: {
    type: String,
    required: [true, "Subtotal is required."]
  },
  tax: {
    type: Number,
    min: [0, "Tax cannot be negative."]
  },
  discount: {
    type: Number,
    min: [0, "Discount cannot be negative."]
  },
  total_amount: {
    type: String,
    required: [true, "Total amount is required."]
  }
});

const Sales = mongoose.models.sales || mongoose.model("sales", SalesSchema);

export default Sales;
