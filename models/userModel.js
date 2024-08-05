const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name Is Required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Password Is Required"],
      minlength: [4, "too Short Password"],
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpies: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },

    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      }
    ],
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    doc.profileImage = `${process.env.BASE_URL}/user/${doc.profileImage}`;
  }
};
userSchema.post("save", (doc) => {
  setImageUrl(doc);
});
userSchema.post("init", (doc) => {
  setImageUrl(doc);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
