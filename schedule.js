const schedule = require("node-schedule");
const { getPrayerTimes } = require("./api");
const bot = require("./core/bot");

const jobs = {
  fajr: {},
  dhuhr: {},
  asr: {},
  maghrib: {},
  isha: {},
};

const messages = {
  fajr: "Bomdod vaqti",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const getMessage = (type) => messages[type];

const scheduleDateAndTime = (userId, date, time, type) => {
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");
  const userData = jobs[type][userId];
  if (userData) {
    const { rule } = userData;
    rule.minute = +minute;
    rule.hour = +hour;
    rule.year = +year;
    rule.month = +month - 1;
    rule.date = +day;
    jobs[type][userId].rule = rule;
  } else {
    // new schedule
    const rule = new schedule.RecurrenceRule();
    rule.minute = +46;
    rule.hour = +23;
    rule.year = +year;
    rule.month = +month - 1;
    rule.date = +day;
    const job = schedule.scheduleJob(rule, () => {
      const text = getMessage(type);
      bot.telegram.sendMessage(userId, text);
      schedulers[type](userId);
    });
    const userData = {
      rule,
      job,
    };
    jobs[type][userId] = userData;
  }
};

const schedulers = {
  fajr: async (userId) => {
    const {
      date,
      times: { tong_saharlik },
    } = await getPrayerTimes();
    scheduleDateAndTime(userId, date, tong_saharlik, "fajr");
  },
  dhuhr: async (userId) => {
    const {
      date,
      times: { peshin },
    } = await getPrayerTimes();
    scheduleDateAndTime(userId, date, peshin, "fajr");
  },
  asr: async (userId) => {
    const {
      date,
      times: { asr },
    } = await getPrayerTimes();
    scheduleDateAndTime(userId, date, asr, "fajr");
  },
  maghrib: async (userId) => {
    const {
      date,
      times: { shom_iftor },
    } = await getPrayerTimes();
    scheduleDateAndTime(userId, date, shom_iftor, "fajr");
  },
  isha: async (userId) => {
    const {
      date,
      times: { hufton },
    } = await getPrayerTimes();
    scheduleDateAndTime(userId, date, hufton, "fajr");
  },
};

module.exports = schedulers;
