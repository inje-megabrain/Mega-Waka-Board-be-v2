import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.sql_ip,
  user: process.env.sql_id,
  password: process.env.sql_password,
  port: process.env.sql_port,
  database: "megatime",
});

connection.connect((error) => {
  if (error) throw error;
});

export default connection;
