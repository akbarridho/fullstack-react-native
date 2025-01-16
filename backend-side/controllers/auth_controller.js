const { User } = require('../models')
const bcrypt = require('bcryptjs');
const { token } = require('../helpers/jsonwebtoken')

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email) {
                throw {"message": "Email is required", "status": 400}
            } else if (!password) {
                throw {"message": "Password is required", "status": 400}
            }

            let data = await User.findOne({ where: { email } })

            if (!data) {
                throw {"message": 'Email not registered yet', "status": 404}
            }

            let isPassword = bcrypt.compareSync(password, data.password);

            if (!isPassword) {
                throw {"message": 'Invalid password', "status": 401}
            }
            let payload = {
                id: data.id
            }
            let access_token = token(payload)
            res.status(200).json({ 'access_token': access_token })

        } catch (error) {
            if (error.status && error.message) {
                res.status(error.status).json({ 'message': error.message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }
}

module.exports = AuthController