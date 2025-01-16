const express = require('express')
const AuctionController = require('../controllers/auction_controller')
const router = express.Router()

router.get('/', AuctionController.getAll)
router.post('/', AuctionController.create)
router.get('/:id', AuctionController.detail)
router.put('/:id', AuctionController.update)
router.delete('/:id', AuctionController.delete)

module.exports = router