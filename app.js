require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_KEY;
const bot = new TelegramBot(token, { polling: true });

bot.on('message',  async (msg) => {
  const chatId = msg.chat.id;
  const Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    await bot.sendMessage(msg.chat.id,`${chatId}하이하이`);
  }
});

bot.on('polling_error', (error) => {
  console.log(error.code);  // => 'EFATAL'
});
