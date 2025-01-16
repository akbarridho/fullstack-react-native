const { Auction } = require('../models')

class AuctionController {
    static async getAll(req, res) {
        try {
            let data = await Auction.findAll({
                where: { is_active: true }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async create(req, res) {
        try {
            const { name, price, img } = req.body
            await Auction.create({ name, price, img, is_sold: false, is_active: true, created_id: req.user.id })
            res.status(201).json({ message: 'Success create auction' })
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
            let data = await Auction.findOne({
                where: { id: id }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params
            const { name, price, img } = req.body
            await Auction.update({ name, price, img, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ message: 'Success update data' })
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Erorr' })
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params
            await Auction.update({ is_active: false, updated_id: req.user.id }, { where: { id: id } })
            res.status(200).json({ message: 'Success delete' })
        } catch (error) {
            res.status(500).json({ 'message': 'Internal Server Erorr' })
        }
    }
}

module.exports = AuctionController