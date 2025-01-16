const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const indexRouter = require('./routers/index')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', indexRouter)

app.listen(port, () => {
  console.log(`Backend side on port ${port}`)
})