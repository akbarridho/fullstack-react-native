const { Role, sequelize } = require("../models");

class RoleController {
    static async getAll(req, res) {
        const t = await sequelize.transaction()
        try {
            let data = await Role.findAll({ where: { is_active: true } })
            if (data.length == 0) {
                let payloadRole = [
                    {
                        "name": "Penjual",
                        "createdAt": new Date(),
                        "updatedAt": new Date()
                    },
                    {
                        "name": "Pembeli",
                        "createdAt": new Date(),
                        "updatedAt": new Date()
                    }
                ]
                let newData = await Role.bulkCreate(payloadRole, { returning: true }, { transaction: t })
                await t.commit()
                res.status(200).json(newData)
            } else {
                await t.commit()
                res.status(200).json(data)
            }
        } catch (error) {
            await t.rollback()
            res.status(500).json({ 'message': 'Internal Server Erorr' })
        }
    }

    static async create(req, res) {
        try {
            const { name } = req.body
            let data = await Role.create({ name: name }, { user_id: req.user.id })
            res.status(201).json(data)
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Erorr' })
            }
        }
    }

    static async update(req, res) {
        try {
            const { name } = req.body
            const { id } = req.params
            await Role.update({ name: name, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ 'message': 'success update' })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Erorr' })
            }
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params
            await Role.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ 'message': 'Success delete data' })
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Error' })
        }
    }
}

module.exports = RoleController