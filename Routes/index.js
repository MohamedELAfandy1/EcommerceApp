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
  app.use("/category", categoryRoute);
  app.use("/subcategoies", subCategoryRoute);
  app.use("/brands", brandRoute);
  app.use("/products", productRoute);
  app.use("/users", usersRoute);
  app.use("/auth", authRoute);
  app.use("/reviews", reviewRoute);
  app.use("/wishlist", wishlistRoute);
  app.use("/address", addressRoute);
  app.use("/coupon", couponRoute);
  app.use("/cart", cartRoute);
  app.use("/order", orderRoute);
};
module.exports = mountRoutes;
