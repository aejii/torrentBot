import {User} from "../domain/user";
import {Mode} from "../domain/mode";
import {accessSequence} from "../handlers/nasHandler";

let loginMode = 0;
let nasHomepage;
let nasId;
let nasPassword;
let user;

let users = new Map();

export const loginController = async (id, msg, bot) => {
    let user = users.get(id);
    if (user && user.active) {
        return
    }
    let text = msg.text;
    switch (loginMode) {
        case 0:
            await bot.sendMessage(msg.chat.id, `나스 주소를 입력해주세요.`, { reply_markup: { hide_keyboard: true } });
            loginMode++;
            break
        case 1:
            nasHomepage = text;
            await bot.sendMessage(msg.chat.id, `나스 아이디를 입력해주세요.`);
            loginMode++;
            break
        case 2:
            nasId = text;
            await bot.sendMessage(msg.chat.id, `나스 비번을 입력해주세요.`);
            loginMode++;
            break
        case 3:
            nasPassword = text;
            await bot.sendMessage(msg.chat.id, `로그인 중입니다.`);
            user = new User(id, nasHomepage, nasId, nasPassword, Mode.NONE);
            const isSuccess: boolean = await accessSequence(user, bot);
            if (isSuccess) {
                console.log('로그인 성공!');
                await bot.sendMessage(msg.chat.id, `로그인 성공!`);
                user.active = true;
                users.set(id, user);
            } else {
                console.log('로그인 실패!');
                await bot.sendMessage(msg.chat.id, `로그인 실패!`);
                loginMode = 0;
                users.delete(id);
            }
            break
        default:
            break
    }
}


