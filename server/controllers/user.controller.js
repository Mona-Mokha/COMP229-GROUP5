import bcrypt from "bcrypt";
import generateToken from '../utils/jwt.js';
import UserModel from "../models/user.model.js";
 
// REGISTER (Donor / Receiver)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, city, province, postal_code } = req.body;
 
    // Check existing user
    const existing = await UserModel.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });
 
    const passwordHash = await bcrypt.hash(password, 10);
 
    const user = await UserModel.create({
      name,
      email,
      passwordHash,
      phone,
      address,
      city,
      province,
      postal_code,
    });
 
    res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });
 
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return res.status(404).json({ message: "Invalid Password" });
 
     const token = generateToken(user);
 
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: error.message });
  }
};
 
 
// GET ALL USERS (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied!" });
    }
 
    const users = await UserModel.find();
 
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};
 
// GET USER BY ID (Profile)
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
 
    // Only admins can view any profile
    // Regular users can only view their own profile
    if (req.user.role !== "Admin" && req.user._id !== userId) {
      return res.status(403).json({ message: "Access denied!" });
    }
 
    const user = await UserModel.findById(userId);
 
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
 
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};
 
// UPDATE BY ID (Profile)
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const isAdmin = req.user.role === "Admin";
    const isSelf = req.user._id.toString() === userId;
 
    // Regular users can only update their own profile
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Access denied!' });
    }
 
    // Fields regular users can update
    const allowedUpdates = ['name', 'phone', 'address', 'city', 'province', 'postal_code'];
    const updates = {};
 
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
 
    // Admin can update role for any user
    if (isAdmin && req.body.role) {
      if (!['User', 'Admin'].includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      updates.role = req.body.role;
    }
 
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true
    });
 
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};
 
// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { oldPassword, newPassword } = req.body;
 
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide old and new password." });
    }
 
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }
 
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
 
    await user.save();
 
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: error.message });
  }
};
 
// DELETE USER BY ID
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
 
    // Only the logged-in user can delete their own account
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied!" });
    }
 
    const deletedUser = await UserModel.findByIdAndDelete(userId);
 
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
 
    res.status(200).json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};