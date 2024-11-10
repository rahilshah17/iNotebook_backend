const { header } = require('express-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Rahilisthebest";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ error: "Access Denied, please login again" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Access Denied, please login again" });
    }


}

module.exports = fetchuser;