const express = require('express')
const TransactionController = require('../controllers/transaction_controller')
const router = express.Router()

router.get('/', TransactionController.getAll)
router.post('/:auctionId', TransactionController.create)

module.exports = router