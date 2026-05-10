const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    phoneno: {
      type: String,
      required: true,
    },

    prodid: {
      type: Number,
      required: true,
    },
    quantity: {
    type: Number,
    default: 1,
    min: 1
},

  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);