const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({
        success: false,
        errorMessage: 'Access denied, unauthorized user'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            errorMessage: 'Invalid Token'
        });
    }
};

