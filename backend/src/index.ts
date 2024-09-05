import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './config/env'
import ConnectToDatabase from './database/ConnectToDB'
import { mainRouter } from './routes/main.router'

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173']

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../public'))

ConnectToDatabase()

app.use('/api/v1/', mainRouter)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const url = `https://foodtimere.onrender.com`
const interval = 30000

function reloadWebsite() {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        console.log('Pinged backend successfully!!')
      } else {
        console.log('Failed to ping backend.')
      }
    })
    .catch((error) => {
      console.log("Can't ping backend!", error)
    })
}

setInterval(reloadWebsite, interval)

app.listen(process.env.PORT, () => {
  console.log('Server started on port - ' + process.env.PORT)
})
