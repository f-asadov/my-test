import { DataSource } from "typeorm"
import dotenv from 'dotenv';

dotenv.config();

export const databaseSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entities/*.ts"],
    synchronize: true,

})