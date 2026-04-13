import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

export const dbConnect = async function () {
  try {
    // Here we connnect the Data Base
    sequelize.authenticate();
    console.log("DataBase is connected Successfully 🎉");

    // sync the table here
    sequelize.sync();
  } catch (error) {
    console.log(`DataBase Connection Failed  ${error}`);
  }
};
