const express = require("express");
const {
  createCashOrder,
  createFilterObject,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  // checkOutSession
} = require("../Controllers/order");
const { auth, allowedTo } = require("../Controllers/auth");
const {
  createCashOrderValidator,
  getSpecificOrderValidator,
  updateOrderToPaidOrDeliveredValidator,
} = require("../Utils/Validators/orderValidator");

const router = express.Router();

// router.get(
//   "/checkouteSession/:cartId",
//   auth,
//   allowedTo("user"),
//   checkOutSession
// );

router
  .route("/:cartId")
  .post(auth, allowedTo("user"), createCashOrderValidator, createCashOrder);
router
  .route("/")
  .get(
    auth,
    allowedTo("user", "manager", "admin"),
    createFilterObject,
    getAllOrders
  );
router
  .route("/:id")
  .get(
    auth,
    allowedTo("user", "manager", "admin"),
    createFilterObject,
    getSpecificOrderValidator,
    getSpecificOrder
  );

router.put(
  "/:id/pay",
  auth,
  allowedTo("admin", "manager"),
  updateOrderToPaidOrDeliveredValidator,
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  auth,
  allowedTo("admin", "manager"),
  updateOrderToPaidOrDeliveredValidator,
  updateOrderToDeliverd
);
module.exports = router;
