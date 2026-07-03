const jwt = require("jsonwebtoken");

const auth = (requiredRole = null) => {
    return async (req, res, next) => {
        try {
            let token = req.header("Authorization");

            if (!token) {
                return res.status(401).json({
                    message: "No token, authorization denied"
                });
            }

            token = token.split(" ")[1];

            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "Token is not valid"
                    });
                }

                req.user = {
                    _id: decoded.id,
                    role: decoded.role
                };

                if (requiredRole && req.user.role !== requiredRole) {
                    return res.status(403).json({
                        message: "Access denied. Invalid role"
                    });
                }

                next();
            });

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    };
};

module.exports = auth;