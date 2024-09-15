// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const apiError = require("../Utils/apiError");
const factory = require("./handlersFactory");

const Order = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new apiError("No Cart For This User", 404));
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  if (order) {
    cart.cartItems.map(async (item) => {
      await ProductModel.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        { new: true }
      );
    });

    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "Success", data: order });
});

exports.createFilterObject = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
});

exports.getAllOrders = factory.getAll(Order);

exports.getSpecificOrder = factory.getOne(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new apiError("No Order For This User", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "Success", data: updatedOrder });
});

exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new apiError("No Order For This User", 404));
  }
  order.isDeliverd = true;
  order.deliverdAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "Success", data: updatedOrder });
});

// exports.checkOutSession = asyncHandler(async (req, res, next) => {
//   console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

//   const taxPrice = 0;
//   const shippingPrice = 0;

//   const cart = await cartModel.findById(req.params.cartId);
//   if (!cart) {
//     return next(new apiError("No Cart For This User", 404));
//   }

//   const cartPrice = cart.totalPriceAfterDiscount
//     ? cart.totalPriceAfterDiscount
//     : cart.totalCartPrice;
//   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: 'egp',
//           product_data: {
//             name: req.user.name,
//           },
//           unit_amount: totalOrderPrice * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${req.protocol}://${req.get('host')}/orders`,
//     cancel_url: `${req.protocol}://${req.get('host')}/cart`,
//     customer_email: req.user.email,
//     client_reference_id: String(cart._id), 
//     metadata: {
//       shipping_address: JSON.stringify(req.body.shippingAddress), 
//     },
//   });

//   res.status(200).json({ status: "success", session });
// });
