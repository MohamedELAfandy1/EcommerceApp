const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon Name Required "],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon Expired Time Is Required "],
    },
    discount: {
      type: Number,
      required: [true, "Coupon Discount Is Required "],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", couponSchema);
