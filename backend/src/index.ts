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

app.get('/set-cookie', (req, res) => {
  res.cookie('testCookie', 'testValue', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  })
  res.send('Cookie set')
})

app.get('/read-cookie', (req, res) => {
  const cookie = req.cookies.testCookie
  res.send(`Cookie value: ${cookie}`)
})
app.use('/api/v1/', mainRouter)

app.listen(process.env.PORT, () => {
  console.log('Server started on port - ' + process.env.PORT)
})
