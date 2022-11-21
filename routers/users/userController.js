import connection from "../../database.js";
import axios from "axios";
export const getUsers = (req, res, next) => {
  const parseDate = (day) => {
    let newDay = day
      .replace("hrs", ":")
      .replace("hr", ":")
      .replace("mins", "")
      .replace("min", "")
      .replace("secs", "")
      .replace("sec", "")
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
        res.status(500).send(e);
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
      await Promise.all(
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
            `UPDATE megatime.member SET ${
              updateDay == 7
                ? "last_7_days"
                : updateDay == 14
                ? "last_14_days"
                : "last_30_days"
            } = '${timeData.data.cummulative_total.text}', ${
              updateDay == 7
                ? "updated_time_7days"
                : updateDay == 14
                ? "updated_time_14days"
                : "updated_time_30days"
            } = '${date.toLocaleString("ko-kr")}' WHERE member_id = ${
              item.member_id
            }`,
            (error) => {
              if (error) throw error;
            }
          );
        })
      );
      res.send("업데이트 성공!");
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

export const addUser = async (req, res, next) => {
  const { username, apikey, organization } = req.query;
  const isApiValid = async () => {
    await axios.get(
      `https://wakatime.com/api/v1/users/current/summaries?range=Today`,
      {
        headers: {
          Authorization: `Basic ${apikey}`,
        },
      }
    );
  };
  try {
    await isApiValid();
    try {
      connection.query(
        `SELECT * FROM megatime.member WHERE username LIKE '${username}'`,
        (error, row) => {
          if (row.length > 0) {
            return res.status(400).send("등록된 사용자입니다.");
          } else {
            try {
              const date = new Date();
              const koDate = date.toLocaleString("ko-kr");
              connection.query(
                `INSERT INTO megatime.member (api_key, username, last_7_days, last_14_days, last_30_days, organization, updated_time_7days, updated_time_14days, updated_time_30days) VALUES ('${apikey}', '${username}', '0:0', '0:0', '0:0', '${organization}', '${koDate}', '${koDate}', '${koDate}')`
              );
              return res.send("등록 성공!");
            } catch (e) {
              return res.status(500).send(e);
            }
          }
        }
      );
    } catch (e) {
      return res.status(500).send();
    }
  } catch (e) {
    if (e.response.status === 401)
      return res.status(401).send("잘못된 api key");
    else return res.status(500).send("서버 오류");
  }
};

export const getUser = (req, res, next) => {
  const { id } = req.query;
  connection.query(
    `SELECT api_key FROM megatime.member WHERE member_id LIKE '${id}'`,
    async (error, row) => {
      if (error) {
        res.status(500).send("error");
        throw error;
      }
      const { data } = await axios.get(
        `https://wakatime.com/api/v1/users/current/summaries?range=last_7_days`,
        {
          headers: {
            Authorization: `Basic ${row[0].api_key}`,
          },
        }
      );
      let newEditorData = [];
      let newLanguageData = [];
      let newProjectData = [];
      data.data.map((i) => {
        i.editors.map((item) => {
          for (let i = 0; i < newEditorData.length; i++) {
            if (item.name === newEditorData[i].name) {
              return (newEditorData[i].seconds += item.total_seconds);
            }
          }
          return newEditorData.push({
            name: item.name,
            seconds: item.total_seconds,
          });
        });
        i.languages.map((item) => {
          for (let i = 0; i < newLanguageData.length; i++) {
            if (item.name === newLanguageData[i].name) {
              return (newLanguageData[i].seconds += item.total_seconds);
            }
          }
          return newLanguageData.push({
            name: item.name,
            seconds: item.total_seconds,
          });
        });
        i.projects.map((item) => {
          for (let i = 0; i < newProjectData.length; i++) {
            if (item.name === newProjectData[i].name) {
              return (newProjectData[i].seconds += item.total_seconds);
            }
          }
          return newProjectData.push({
            name: item.name,
            seconds: item.total_seconds,
          });
        });
      });
      res.send({
        editors: newEditorData,
        languages: newLanguageData,
        projects: newProjectData,
      });
    }
  );
};
