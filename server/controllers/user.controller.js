import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, city, province, postal_code } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      phone,
      address,
      city,
      province,
      postal_code,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  res.json(req.user);
};

export const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.passwordHash;
    delete updates.password;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-passwordHash");

    res.json({ message: "Profile updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
