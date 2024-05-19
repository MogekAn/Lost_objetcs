const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ensureAuthenticated = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const ensureAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'User not authorized' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { ensureAuthenticated, ensureAdmin };
