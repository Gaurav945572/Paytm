const jwt = require("jsonwebtoken");
const { jwtPassword } = require("../config");

function UserMiddleware(req, res, next) {
    // Check if the authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is missing",
        });
    }

    // Split the token from the 'Bearer' scheme
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Malformed authorization header",
        });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, jwtPassword);
        console.log(decoded.userId);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token verification failed",
            error: error.message,
        });
    }
}

module.exports = { UserMiddleware };
