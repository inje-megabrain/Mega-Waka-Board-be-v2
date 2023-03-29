import { EmbedBuilder } from "discord.js";
import { collection, getDocs } from "firebase/firestore";
import { scheduleJob } from "node-schedule";
import fireStore from "../Firebase.js";

const knowDaysValue = (data) => {
  return data.sort((a, b) => {
    const sortA = a["7days"];
    const sortB = b["7days"];

    if (sortA.indexOf(":") === -1) return 1;
    if (sortB.indexOf(":") === -1) return -1;
    return parseInt(sortB.split(":")[0]) < parseInt(sortA.split(":")[0])
      ? -1
      : parseInt(sortB.split(":")[0]) > parseInt(sortA.split(":")[0])
      ? 1
      : parseInt(sortB.split(":")[1]) < parseInt(sortA.split(":")[1])
      ? -1
      : 1;
  });
};

const postWeekRank = (client) => {
  const channelid = process.env.CHANNEL_ID;
  const guildid = process.env.GUILD_ID;
  try {
    const today = new Date();
    const lastweek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    scheduleJob({ hour: 15, minute: 00, dayOfWeek: 5 }, async () => {
      await updateTime();
      const querySnapshot = await getDocs(collection(fireStore, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      const sortedUsers = knowDaysValue(users);
      if (sortedUsers.length < 3) return;
      const successEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("이번주 와카타임 랭킹")
        .setURL("https://waka.megabrain.kr/")
        .setDescription(
          `${lastweek.getFullYear()}년 ${
            lastweek.getMonth() + 1
          }월 ${lastweek.getDate()}일 ~ ${lastweek.getFullYear()}년 ${
            today.getMonth() + 1
          }월 ${today.getDate()}일 와카타임 랭킹`
        )
        .addFields({
          name: `1등 - ${sortedUsers[0].username}`,
          value: `${sortedUsers[0]["7days"]}`,
        })
        .addFields({
          name: `2등 -  ${sortedUsers[1].username}`,
          value: `${sortedUsers[1]["7days"]}`,
        })
        .addFields({
          name: `3등 - ${sortedUsers[2].username}`,
          value: `${sortedUsers[2]["7days"]}`,
        })
        .addFields({
          name: `꼴등 - ${sortedUsers[sortedUsers.length - 1].username}`,
          value: `${sortedUsers[sortedUsers.length - 1]["7days"]}`,
        })
        .setTimestamp();

      const guild = client.guilds.cache.get(guildid);
      if (guild && guild.channels.cache.get(channelid)) {
        await guild.channels.cache
          .get(channelid)
          .send({ embeds: [successEmbed] });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export default postWeekRank;
