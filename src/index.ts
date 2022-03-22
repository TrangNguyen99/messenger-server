import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import express, {NextFunction, Request, Response} from 'express'
import admin from 'firebase-admin'
import http from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import {Server} from 'socket.io'
import {env} from './constant/env'
import {ERROR_MESSAGE} from './constant/error'
import {HTTP_STATUS_CODE} from './constant/httpStatusCode'
import {api} from './route'
import serviceAccount from './serviceaccount.json'

const x: any = serviceAccount

const main = async () => {
  try {
    await mongoose.connect(`${env.MONGODB_URI}`)

    const app = express()
    const server = http.createServer(app)
    const io = new Server(server)

    io.on('connection', socket => {
      socket.join(socket.handshake.auth.userId)

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      socket.on('disconnect', () => {})
    })

    admin.initializeApp({
      credential: admin.credential.cert(x),
    })

    app.use(cors())
    app.use(express.json())
    app.use(morgan('dev'))

    app.use((req, res, next) => {
      res.locals.io = io
      next()
    })

    app.get('/', (req, res) => {
      res.json({
        type: 'success',
        message: 'Server is running',
        data: null,
      })
    })

    app.use('/api', api)

    app.use('*', (req, res, next) => {
      const error = {
        status: HTTP_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.API_ENDPOINT_NOT_FOUND,
      }
      next(error)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
      const message = err.message || ERROR_MESSAGE.SERVER_ERROR
      const data = err.data || null

      res.status(status).json({
        type: 'error',
        message,
        data,
      })
    })

    server.listen(parseInt(`${env.PORT}`), () =>
      console.log(`Server is listening on port ${env.PORT}`),
    )
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

main()
