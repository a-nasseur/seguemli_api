module.exports = function (req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send("Forbidden Action, you need administrator privileges");

    next();
};