import NotificationModel from "../models/notification.model.js";
 
// CREATE NOTIFICATION
export const createNotification = async (userId, requestId, type, message) => {
    try {
        await NotificationModel.create({
            userId,
            requestId,
            type,
            message,
            read: false
        });
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
 
 
// GET ALL NOTIFICATIONS BY USER ID
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
 
        const notifications = await NotificationModel.find({ userId })
            .sort({ created: -1 });
 
        res.status(200).json({ message: "Notifications fetched successfully", notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: error.message });
    }
};
 
 
// MARK NOTIFICATION AS READ
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
 
        if (!notification)
            return res.status(404).json({ message: "Notification not found." });
 
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied!" });
        }
 
        notification.read = true;
        await notification.save();
 
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ message: error.message });
    }
};
 
 
// DELETE NOTIFICATION
export const deleteNotification = async (req, res) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
 
        if (!notification) return res.status(404).json({ message: "Notification not found." });
 
        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied!" });
        }
 
        await NotificationModel.findByIdAndDelete(req.params.id);
 
        res.status(200).json({ message: "Notification deleted successfully." });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: error.message });
    }
};