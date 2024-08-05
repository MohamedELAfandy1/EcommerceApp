const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order Must be Belong Yo User"],
    },
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "product" },
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDeliverd: { type: Boolean, default: false },
    deliverdAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name " }).populate({
    path: "cartItems.product",
    select: "title",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
