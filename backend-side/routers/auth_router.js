const express = require('express')
const AuthController = require('../controllers/auth_controller')
const UserController = require('../controllers/user_controller')
const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', AuthController.login)

module.exports = router