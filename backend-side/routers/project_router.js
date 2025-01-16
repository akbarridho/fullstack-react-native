const express = require('express')
const ProjectController = require('../controllers/project_controller')
const router = express.Router()

router.get('/', ProjectController.getAll)
router.post('/', ProjectController.create)
router.get('/:id', ProjectController.getDetail)
router.put('/:id', ProjectController.update)
router.delete('/:id', ProjectController.delete)

module.exports = router