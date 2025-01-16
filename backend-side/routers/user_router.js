const express = require('express')
const UserController = require('../controllers/user_controller')
const router = express.Router()

router.get('/', UserController.getDetail)
router.put('/:id', UserController.update)
router.delete('/:id', UserController.delete)

module.exports = router