require("dotenv").config();

const bot = require("./core/bot");
const schedulers = require("./schedule");

bot.start((ctx) => {
  ctx.reply("Salom");

  const userId = ctx.from.id;

  // schedule all
  Object.keys(schedulers).forEach((key) => {
    schedulers[key](userId);
  });
});

bot.launch();
console.log("Bot started");
