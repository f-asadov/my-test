import express from 'express';
import cors from 'cors'
import cookieParse from 'cookie-parser'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { databaseSource } from '../ormconfig';
import {router} from './routes'

dotenv.config();

const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api',router)


databaseSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started succesfully on PORT : ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()