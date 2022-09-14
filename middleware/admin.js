module.exports = function (req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send("Forbidden action, you need administrator privileges");
    
    next();
};