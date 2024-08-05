const categoryRoute = require("./category.js");
const subCategoryRoute = require("./subCategory.js");
const brandRoute = require("./brand.js");
const productRoute = require("./product.js");
const usersRoute = require("./user.js");
const authRoute = require("./auth.js");
const reviewRoute = require("./review.js");
const wishlistRoute = require("./wishlist.js");
const addressRoute = require("./address.js");
const couponRoute = require("./coupon.js");
const cartRoute = require("./cart.js");
const orderRoute = require("./order.js");

const mountRoutes = (app) => {
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/subcategoies", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/coupon", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
};

module.exports = mountRoutes;
