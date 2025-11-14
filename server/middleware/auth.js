import jwt from "jsonwebtoken";
 
const authMiddleware = (req, res, next) => {
 
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
 
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Please log in." });
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded._id || !decoded.role) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
 
        req.user = {
            _id: decoded._id,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
 
export default authMiddleware;