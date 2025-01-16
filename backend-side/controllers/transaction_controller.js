const { Transaction, Auction, sequelize, User, Role, Profile } = require('../models')

class TransactionController {
    static async getAll(req, res) {
        try {
            let data = await Transaction.findAll({
                attributes: ['id', 'user_id', 'auction_id'],
                where: {
                    user_id: req.user.id,
                    is_active: true
                },
                include: [
                    {
                        model: Auction,
                        as: 'auction'
                    }
                ]
            })
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async create(req, res) {
        const t = await sequelize.transaction()
        try {
            const { auctionId } = req.params

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
            if (dataUser.profile.role.name == 'Penjual') {
                throw {message: "Only 'Pembeli' can purchase", status: 400}
            }
 
            let dataAuction = await Auction.findOne({ where: { id: auctionId }, attributes: ['id', 'is_sold'] })
            if (dataAuction.is_sold) {
                throw { message: 'Data already sold', status: 400 }
            }

            await Transaction.create({ auction_id: auctionId, user_id: req.user.id, created_id: req.user.id }, { transaction: t })
            await Auction.update({ is_sold: true }, { where: { id: auctionId } }, { transaction: t })
            res.status(201).json({ message: 'Success purchase' })
            await t.commit()
        } catch (error) {
            await t.rollback()
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ message: error.errors[0].message })
            } else if (error.message && error.status) {
                res.status(error.status).json({ message: error.message })
            } else {
                res.status(500).json({ 'message': 'Internal Server Error' })
            }
        }
    }
}

module.exports = TransactionController