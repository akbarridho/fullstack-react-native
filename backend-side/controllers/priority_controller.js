const { Priority, sequelize } = require('../models')

class PriorityController {
    static async getAll(req, res) {
        try {
            let data = await Priority.findAll()
            if (data.length == 0) {
                let payloadPriority = [
                    {
                        name: 'High',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Medium',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        name: 'Low',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
                let newData = await Priority.bulkCreate(payloadPriority, { returning: true })
                res.status(200).json(newData)
            } else {
                res.status(200).json(data)
            }
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Error' })
        }
    }

    static async getDetail(req, res) {
        try {
            const { id } = req.params
            const data = await Priority.findOne({ where: { id: id } })
            if (!data) {
                throw { message: 'Not found', status: 404 }
            }
            res.status(200).json(data)
        } catch (error) {
            if (error.message && error.status) {
                res.status(error.status).json({ message: error.message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }

    static async create(req, res) {
        let t = await sequelize.transaction()
        try {
            const { name } = req.body
            let data = await Priority.create({ name: name }, { user_id: req.user.id })
            await t.commit()
            res.status(201).json(data)
        } catch (error) {
            await t.rollback()
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }

    static async update(req, res) {
        let t = await sequelize.transaction()
        try {
            const { name } = req.body
            const { id } = req.params
            await Priority.update({ name: name, updated_id: req.user.id }, { where: { id: id } })
            await t.commit()
            res.status(201).json({ 'message': 'Success update data' })
        } catch (error) {
            await t.rollback()
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params
            await Priority.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ 'message': 'Success delete data' })
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Error' })
        }
    }
}

module.exports = PriorityController