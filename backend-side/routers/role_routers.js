const express = require('express')
const router = express.Router()
const RoleController = require('../controllers/role_controller')
const { isLogin } = require('../middlewares/authentication')

router.get('/', RoleController.getAll)
router.post('/', isLogin, RoleController.create)
router.put('/:id', isLogin, RoleController.update)
router.delete('/:id', isLogin, RoleController.delete)

module.exports = router