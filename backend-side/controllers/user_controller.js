const { User, Profile, Role, sequelize } = require('../models')

class UserController {
    static async register(req, res) {
        try {
            const { email, password, name, role_id } = req.body
            let dataUser = await User.create({ email: email, password: password })
            await Profile.create({ name: name, user_id: dataUser.id, role_id: role_id }, { user_id: dataUser.id })
            res.status(201).json({ "message": "success create data" })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal server error" })
            }
        }
    }

    static async getDetail(req, res) {
        try {
            // query
            let data = await User.findOne({
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
            // transform data
            let json_data = await data.toJSON()
            for (let key in json_data.profile) {
                json_data = await {
                    ...json_data,
                    [key]: json_data.profile[key]
                }
            }
            delete json_data['profile']
            res.status(200).json(json_data)
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    static async update(req, res) {
        let t = await sequelize.transaction()
        try {
            const { id } = req.params
            const { email, password, name, role_id } = req.body
            await User.update({ email: email, password: password, updated_id: req.user.id }, { where: { id: id }, individualHooks: true }, { transaction: t })
            await Profile.update({ name: name, user_id: id, role_id: role_id, updated_id: req.user.id }, { where: { user_id: id } }, { transaction: t })
            await t.commit()
            res.status(200).json({ message: "Success update data" })
        } catch (error) {
            await t.rollback()
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal Server Error" })
            }
        }
    }

    static async delete(req, res) {
        let t = await sequelize.transaction()
        try {
            const { id } = req.params
            await User.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } }, { transaction: t })
            await Profile.update({ is_active: false, updated_id: req.user.id }, { where: { user_id: id } }, { transaction: t })
            await t.commit()
            res.status(200).json({ message: "Success delete data" })
        } catch (error) {
            await t.rollback()
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

module.exports = UserController