import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import fireStore from "../../Firebase.js";

export const updateTime = async (req, res, next) => {
  const { updateDay } = req.query;
  if (updateDay !== "7" && updateDay !== "14" && updateDay !== "30") {
    return res.send("updateDay param이 잘못되었습니다.");
  }
  try {
    const querySnapshot = await getDocs(collection(fireStore, "users"));
    const userData = [];
    await querySnapshot.forEach(async (doc) => {
      userData.push({ apikey: doc.data().apikey, id: doc.id });
    });

    for await (const user of userData) {
      const result = await axios.get(
        `https://wakatime.com/api/v1/users/current/summaries/?range=Last_${updateDay}_days`,
        {
          headers: {
            Authorization: `Basic ${btoa(user.apikey)}`,
          },
        }
      );
      if (result.data.cumulative_total.digital) {
        const userDoc = doc(fireStore, "users", user.id);
        if (updateDay === "7") {
          await updateDoc(userDoc, {
            "7days": result.data.cumulative_total.digital,
          });
        } else if (updateDay === "14") {
          await updateDoc(userDoc, {
            "14days": result.data.cumulative_total.digital,
          });
        } else {
          await updateDoc(userDoc, {
            "30days": result.data.cumulative_total.digital,
          });
        }
      }
    }
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
