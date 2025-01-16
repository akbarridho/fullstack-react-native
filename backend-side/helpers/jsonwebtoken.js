const jwt = require('jsonwebtoken');

let token = (payload) => {
    return jwt.sign(payload, 'shhhh');  
}

let decoded = (token) => {
    return jwt.verify(token, 'shhhh')
}

module.exports = { token, decoded }