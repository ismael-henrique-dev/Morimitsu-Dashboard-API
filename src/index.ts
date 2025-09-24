import express from 'express'
import cors from 'cors'
import { ENV } from './lib/env'

const app = express()

app.use(express.json())
app.use(cors())

const port = ENV.PORT

app.get('/hello', (req, res) => {
  res.send('Helloasas World!')
})

app.post('/student/create', (req, res) => {
  const { name, email, cpf } = req.body

  res.send('Helloasas World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
