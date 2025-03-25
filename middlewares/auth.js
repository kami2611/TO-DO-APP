const jwt = require('jsonwebtoken');

function verifyJwt(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.send('not authenticated');
    }
    try {
        const user = jwt.verify(token, 'mysupersecrettokenkey');
        req.user = user;
        next();
    } catch (err) {
        return res.send('invalid token');
    }
}

module.exports = verifyJwt;