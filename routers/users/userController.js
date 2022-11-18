import connection from "../../database.js";
import axios from "axios";
export const getUsers = (req, res, next) => {
  const parseDate = (day) => {
    let newDay = day
      .replace("hrs", ":")
      .replace("hr", ":")
      .replace("mins", "")
      .replace("min", "")
      .replaceAll(" ", "");
    if (newDay.indexOf(":") === -1) {
      newDay = "0:" + newDay;
    }
    if (newDay.indexOf(":") === newDay.length - 1) {
      newDay = newDay + "0";
    }
    return newDay;
  };
  connection.query(
    "SELECT username, last_7_days, last_14_days, last_30_days, Organization FROM megatime.member",
    (error, row) => {
      if (error) throw error;
      const date = new Date();
      try {
        const newRow = row.map((item) => {
          return (
            item && {
              ...item,
              last_7_days: parseDate(item.last_7_days),
              last_14_days: parseDate(item.last_14_days),
              last_30_days: parseDate(item.last_30_days),
            }
          );
        });
        res.send(newRow);
      } catch (e) {
        throw e;
      }
    }
  );
};

export const updateTime = (req, res, next) => {
  const { updateDay } = req.query;
  const date = new Date();
  try {
    connection.query("SELECT * FROM megatime.member", async (error, row) => {
      if (error) throw error;
      const newRow = await Promise.all(
        row.map(async (item) => {
          const timeData = await axios.get(
            `https://wakatime.com/api/v1/users/current/summaries/?range=Last_${updateDay}_days`,
            {
              headers: {
                Authorization: `Basic ${item.api_key}`,
              },
            }
          );
          await connection.query(
            `UPDATE megatime.member SET last_7_days = '${
              timeData.data.cummulative_total.text
            }', updated_time_7days = '${date.toLocaleString(
              "ko-kr"
            )}' WHERE member_id = ${item.member_id}`,
            (error) => {
              if (error) throw error;
            }
          );
        })
      );
      res.send("업데이트 성공!");
    });
  } catch (e) {
    throw e;
  }
};
