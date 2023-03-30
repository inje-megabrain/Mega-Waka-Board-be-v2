import axios from "axios";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import fireStore from "../../Firebase.js";

const updateUser = async (updateDay) => {
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
  } catch (e) {
    console.log(e);
  }
};

export default updateUser;
