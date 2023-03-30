import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import fireStore from "../../Firebase.js";
import updateUser from "./updateUser.js";

export const updateTime = async (req, res, next) => {
  const { updateDay } = req.query;
  if (updateDay !== "7" && updateDay !== "14" && updateDay !== "30") {
    return res.send("updateDay param이 잘못되었습니다.");
  }
  try {
    await updateUser(updateDay);
    res.send("업데이트 성공!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const addUser = async (req, res, next) => {
  const { username, apikey, organization } = req.query;

  const isKeyValid = await getWakaApiValid(apikey);
  if (!isKeyValid) {
    res.send("apikey가 유효하지 않습니다.");
    return;
  }
  const querySnapshot = await getDocs(collection(fireStore, "users"));
  let isExist = false;
  querySnapshot.forEach((doc) => {
    if (doc.data().apikey === apikey) {
      isExist = true;
      return;
    }
  });
  if (isExist) {
    res.send("이미 등록된 apikey입니다.");
    return;
  }
  try {
    await addDoc(collection(fireStore, "users"), {
      username: username,
      apikey: apikey,
      organization: organization,
      "7days": "0:0",
      "14days": "0:0",
      "30days": "0:0",
    });
    res.send("등록 성공");
  } catch (e) {
    console.log(e);
    res.send("등록 실패!");
    return;
  }
};

const getWakaApiValid = async (apikey) => {
  try {
    await axios.get(
      "https://wakatime.com/api/v1/users/current/summaries?range=Today",
      {
        headers: {
          Authorization: `Basic ${btoa(apikey)}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUser = async (req, res, next) => {
  const { day, id } = req.query;
  if ([7, 14, 30].indexOf(parseInt(day)) == -1) {
    res.status(400).send("param 오류");
    return;
  }

  try {
    const querySnapshot = await getDoc(doc(fireStore, "users", id));

    if (querySnapshot.exists()) {
      const userData = querySnapshot.data();
      const { data } = await axios.get(
        `https://wakatime.com/api/v1/users/current/summaries?range=last_${day}_days`,
        {
          headers: {
            Authorization: `Basic ${btoa(userData.apikey)}`,
          },
        }
      );
      let newEditorData = [];
      let newLanguageData = [];
      let newProjectData = [];
      let newWeekLabel = [];
      let newWeekData = [];
      data.data.map((i, index) => {
        const date = new Date(data.start);

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
        date.setDate(date.getDate() + index + 1);
        newWeekLabel.push(date.getUTCMonth() + 1 + "/" + date.getUTCDate());
        newWeekData.push(i.grand_total.total_seconds);
      });
      res.send({
        username: userData.username,
        weekData: { label: newWeekLabel, data: newWeekData },
        day_7_info: data.cumulative_total,
        editors: newEditorData,
        languages: newLanguageData,
        projects: newProjectData,
      });
    } else {
      res.send("존재하지 않는 유저입니다.");
    }
  } catch (e) {
    console.log(e);
    res.send("오류 발생");
  }
};
