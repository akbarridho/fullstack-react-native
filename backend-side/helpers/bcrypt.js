const bcrypt = require('bcryptjs');

let hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash
}

module.exports = { hashPassword }