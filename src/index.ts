import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'
import { Mode } from "./domain/mode";
import { User } from "./domain/user";
import { accessSequence } from "./handlers/nasHandler";
import {loginController} from "./controllers/loginController";
import exp from "constants";

const token = process.env.TELEGRAM_KEY
const bot = new TelegramBot(token, { polling: true })

const users = new Map();

const LOGIN = "나스 로그인";
const SEARCH_TORRENT = "토렌트 키워드 검색";
const TORRENT_BEST = "장르별 베스트 보기";
const SHOW_STATUS = "다운로드 목록";
const HOME_BACK = "처음으로";

const MOVIE = "영화";
const DRAMA = "TV드라마";
const ENT = "TV예능";
const TV = "도서/만화";
const ANI = "애니메이션";
const MUSIC = "해외음원";

bot.on('message', async msg => {
    const id = msg.chat.id
    const text = msg.text;

    console.log(id, text);
    let user = users.get(id);
    console.log(users.get(id));

    switch (text) {
        case LOGIN:
            users.set(id, Mode.LOGIN);
            break;
        case SEARCH_TORRENT:
            break;
        case TORRENT_BEST:
            break;
        case SHOW_STATUS:
            break;
        case HOME_BACK:
            users.delete(id);
            break;
        default:
            break;
    }

    user = users.get(id);

    switch (user) {
        case undefined:
            await goHome(id);
            break;
        case Mode.LOGIN:
            await loginController(id, msg, bot);
            break;
    }


    switch (text) {

    }

    // await bot.sendMessage(msg.chat.id, `${id}하이하이`)
})

export const goHome = async (id) => {
    await bot.sendMessage(id, '원하시는 메뉴를 선택 해주세요.', {
        reply_markup: {
            keyboard: [
                [LOGIN],
                [SEARCH_TORRENT],
                [TORRENT_BEST],
                [SHOW_STATUS],
                [HOME_BACK],
            ]
        }
    });
};

bot.on('polling_error', error => {
    console.log(error.code) // => 'EFATAL'
})
