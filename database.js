import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.SQL_IP,
  user: process.env.SQL_ID,
  password: process.env.SQL_PASSWORD,
  port: process.env.SQL_PORT,
  database: "megatime",
});

connection.connect((error) => {
  if (error) console.log(error);
});

export default connection;
