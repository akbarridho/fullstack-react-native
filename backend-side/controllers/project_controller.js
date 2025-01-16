const { Project, Task, sequelize } = require('../models')

class ProjectController {
    static async getAll(req, res) {
        try {
            let data = await Project.findAll({ where: { is_active: true }, attributes: ['id', 'name'] })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async create(req, res) {
        try {
            const { name } = req.body
            await Project.create({ name: name }, { user_id: req.user.id })
            res.status(201).json({ message: 'Success create data' })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }

    static async getDetail(req, res) {
        try {
            const { id } = req.params
            let data = await Project.findByPk(id)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Error' })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body
            await Project.update({ name: name, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ message: "Success update data" })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }

    static async delete(req, res) {
        const t = await sequelize.transaction()
        try {
            const { id } = req.params
            await Task.update({ is_active: false, updated_id: req.user.id }, { where: { project_id: id } }, { transaction: t })
            await Project.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } }, { transaction: t })
            t.commit()
            res.status(200).json({ message: "Success delete data" })
        } catch (error) {
            t.rollback()
            res.status(500).json({ 'message': 'Internal Server Error' })
        }
    }
}

module.exports = ProjectController