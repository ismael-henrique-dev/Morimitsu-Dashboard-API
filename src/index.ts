import express from 'express'
import cors from 'cors'
import { ENV } from './lib/env'
import { routes } from './routes/router'
import { setupSwagger } from './docs/swagger'

const app = express()

setupSwagger(app)

app.use(express.json())
app.use(cors())

app.use('/auth', routes.auth)
app.use('/classes', routes.class)
app.use('/students', routes.student)
app.use('/users', routes.user)
app.use('/attendence', routes.attendence)
app.use('/sessions', routes.sessions)

const port = ENV.PORT

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Teste