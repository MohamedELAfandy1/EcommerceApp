const express = require("express");
const { auth, allowedTo } = require("../Controllers/auth");
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../Controllers/coupon");
const {
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  createCouponValidator,
} = require("../Utils/Validators/couponValidator");

const router = express.Router();

router
  .route("/")
  .get(auth, allowedTo("admin", "manager"), getCoupons)
  .post(
    auth,
    allowedTo("admin", "manager"),
    createCouponValidator,
    createCoupon
  );

router
  .route("/:id")
  .get(auth, allowedTo("admin", "manager"), getCouponValidator, getCoupon)
  .put(auth, allowedTo("admin", "manager"), updateCouponValidator, updateCoupon)
  .delete(
    auth,
    allowedTo("admin", "manager"),
    deleteCouponValidator,
    deleteCoupon
  );

module.exports = router;
