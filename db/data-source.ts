import { DataSource, DataSourceOptions } from "typeorm";
// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/db/migrations/*.js"],
    synchronize: false,
    // logging: true,
    // schema: "public",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
