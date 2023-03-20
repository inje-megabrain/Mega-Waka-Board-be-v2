import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const db_config = {
  host: process.env.SQL_IP,
  user: process.env.SQL_ID,
  password: process.env.SQL_PASSWORD,
  port: process.env.SQL_PORT,
  database: "megatime",
};

var connection;

function handleDisconnect() {
  //함수 정의
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {
    console.log("DBConnected!");
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); //연결 실패시 2초 후 다시 연결
    }
  });

  connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("MySql_DBError) PROTOCOL_CONNECTION_LOST");
      handleDisconnect(); //연결 오류시 호출하는 재귀함수
    } else {
      console.log("MySql_DBError)", err);
      throw err;
    }
  });
}

handleDisconnect(); //require과 동시에 실행됨

export default connection;
