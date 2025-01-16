const express = require('express')
const router = express.Router()
const rolesRouter = require('./role_routers')
const authRouter = require('./auth_router')
const userRouter = require('./user_router')
const priorityRouter = require('./priority_router')
const projectRouter = require('./project_router')
const taskRouter = require('./task_router')
const auctionRouter = require('./auction_router')
const transactionRouter = require('./transaction_router')
const { isLogin, isPenjual } = require('../middlewares/authentication')

router.use('/auth', authRouter)

router.use('/users', isLogin, userRouter)
router.use('/roles', rolesRouter)
router.use('/priorities', isLogin, isPenjual, priorityRouter)
router.use('/projects', isLogin, isPenjual, projectRouter)
router.use('/tasks', isLogin, isPenjual, taskRouter)
router.use('/auctions', isLogin, auctionRouter)
router.use('/transactions', isLogin, transactionRouter)

module.exports = router