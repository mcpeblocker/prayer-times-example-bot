const axios = require("axios").default;

const api = axios.create({
  baseURL: "https://islomapi.uz/api",
});

const getPrayerTimes = async (region = "Tashkent") => {
  try {
    const { status, data } = await axios.get("https://islomapi.uz/api/present/day?region=Toshkent");
    if (status !== 200) return null;
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  getPrayerTimes,
};
