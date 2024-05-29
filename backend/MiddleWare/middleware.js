const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        console.log(JWT_SECRET);

        next();
    // } catch (err) {
    //     return res.status(403).json({
    //         "message":"wrong token"
    //     });
    // }
};

module.exports = {
    authMiddleware
}