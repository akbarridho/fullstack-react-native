const { decoded } = require('../helpers/jsonwebtoken')
const { User, Profile, Role } = require('../models')

const isLogin = async function (req, res, next) {
    try {
        const { access_token } = req.headers
        let dataDecoded = decoded(access_token)
        if (!dataDecoded) {
            throw { name: "JsonWebTokenError" }
        } else {
            let data = await User.findByPk(dataDecoded.id)
            if (data) {
                req.user = {
                    id: data.id
                }
                next()
            } else {
                res.status(404).json({ message: "Not found" })
            }
        }
    } catch (error) {
        if (error.name == 'JsonWebTokenError') {
            res.status(401).json({ message: "Invalid Token" })
        } else if (error.name == 'InvalidAccess') {
            res.status(401).json({ message: "You are not authorized" })
        } else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

const isPenjual = async function (req, res, next) {
    try {
        let dataUser = await User.findOne({
            attributes: ['id', 'email', 'password'],
            where: { id: req.user.id },
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['name', 'role_id'],
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            attributes: ['name']
                        }
                    ]
                }
            ]
        })

        if (dataUser.profile.role.name == 'Pembeli') {
            throw {message: "For Penjual only", status: 403}
        } else {
            next()
        }
    } catch (error) {
        if (error.message && error.status) {
            res.status(error.status).json({message: error.message})
        } else {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

module.exports = { isLogin, isPenjual }