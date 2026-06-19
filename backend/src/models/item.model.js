import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;