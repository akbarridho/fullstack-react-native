const express = require('express')
const PriorityController = require('../controllers/priority_controller')
const router = express.Router()

router.get('/', PriorityController.getAll)
router.post('/', PriorityController.create)
router.get('/:id', PriorityController.getDetail)
router.put('/:id', PriorityController.update)
router.delete('/:id', PriorityController.delete)

module.exports = router