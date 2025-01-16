const express = require('express')
const TaskController = require('../controllers/task_controller')
const router = express.Router()

router.get('/byId/:id', TaskController.detail)
router.put('/byId/:id', TaskController.update)
router.delete('/byId/:id', TaskController.delete)
router.patch('/byId/:id', TaskController.updateDone)
router.get('/:project_id', TaskController.getAll)
router.post('/:project_id', TaskController.create)

module.exports = router