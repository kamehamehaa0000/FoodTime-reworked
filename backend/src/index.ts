import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './config/env'
import ConnectToDatabase from './database/ConnectToDB'
import { mainRouter } from './routes/main.router'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173', // Ensure this matches your frontend origin
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('../public'))
ConnectToDatabase()

app.use('/api/v1/', mainRouter)

app.listen(process.env.PORT, () => {
  console.log('Server started on port - ' + process.env.PORT)
})
