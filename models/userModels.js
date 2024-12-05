const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: { 
      type: String,
      required: [true, "Please provide tour email address"],
      unqiue: [true, "This email address already exist"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    picture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Hey there ! I am using whatsapp",
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        6,
        "Plase make sure your password is atleast 6 characters long",
      ],
      maxLength: [
        128,
        "Plase make sure your password is less than 128 characters long",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports= mongoose.model("UserModel", userSchema);
