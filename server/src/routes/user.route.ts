import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../modals/user.modal.ts";
import bcrypt from "bcrypt";

router.post("/signin", async (req, res) => {
  async function sigin() {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
        // throw new Error("Invalid email or password");
      }

      const tokenData = {
        id: user._id,
        username: user.name,
        email: user.email,
      };

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "7d",
      });
      // Set the cookie first
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ message: "loged in sucessfully" });
      // .cookie("token", token, {
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });
    } catch (err) {
      console.log("in error block");

      res.status(401).json({ message: "Authentication problem!!" });
      console.log(err);
    }
  }
  sigin();
});

router.post("/register", async (req, res) => {
  async function register() {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword });
      const savedUser = await newUser.save();

      // console.log(newUser);

      res.status(200).json({
        message: "User registered successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  }
  register();
});

export default router;
