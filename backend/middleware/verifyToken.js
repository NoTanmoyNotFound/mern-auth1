import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token; // Safely extract the token from cookies

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach userId to the request object
        req.userId = decoded.userId;
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error("Error in verifyToken:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid token",
        });
    }
};
