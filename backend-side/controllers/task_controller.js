const { Task, Priority } = require('../models')

class TaskController {
    static async getAll(req, res) {
        try {
            //  params
            const { priority_id } = req.query
            const { project_id } = req.params
            // condition main table
            let options = {
                attributes: ['id', 'name', 'description', 'priority_id', 'project_id', 'is_done', 'createdAt'],
                where: { is_active: true, project_id: project_id },
            }
            //  check if priority_id is exists or not
            if (priority_id) {
                options['where']['priority_id'] = priority_id
            }
            // join query
            options['include'] = [
                { model: Priority, as: 'priority', attributes: ['name'] }
            ]
            // order by
            options['order'] = [
                ['createdAt', 'DESC']
            ]
            let data = await Task.findAll(options)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async create(req, res) {
        try {
            const { project_id } = req.params
            const { name, description, priority_id } = req.body
            await Task.create({ name: name, description: description, priority_id: priority_id, project_id: project_id }, { user_id: req.user.id })
            res.status(201).json({ message: 'Success create task' })
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
            const { id } = req.params
            const { name, description, priority_id } = req.body
            await Task.update({ name: name, description: description, priority_id: priority_id, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ message: 'Success update data' })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Erorr' })
            }
        }
    }

    static async detail(req, res) {
        try {
            const { id } = req.params
            let data = await Task.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'description', 'project_id', 'priority_id', 'is_done'],
                include: [
                    { model: Priority, as: 'priority', attributes: ['name'] }
                ]
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    }

    static async updateDone(req, res) {
        try {
            const { id } = req.params
            await Task.update({ is_done: true, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ message: "The task is completed" })
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Erorr' })
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params
            await Task.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({message: 'Success delete'})
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Erorr' })
        }
    }
}

module.exports = TaskController