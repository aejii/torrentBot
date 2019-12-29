import {User} from "../domain/user";
import {Mode} from "../domain/mode";
import {accessSequence} from "../handlers/nasHandler";

let loginMode = 0;
let nasHomepage;
let nasId;
let nasPassword;
let user;

export const loginController = async (users, id, msg, bot) => {
    let text = msg.text;
    switch (loginMode) {
        case 0:
            nasHomepage = text;
            await bot.sendMessage(msg.chat.id, `나스 아이디를 입력해주세요.`);
            loginMode++;
            break
        case 1:
            nasId = text;
            await bot.sendMessage(msg.chat.id, `나스 비번을 입력해주세요.`);
            loginMode++;
            break
        case 2:
            nasPassword = text;
            await bot.sendMessage(msg.chat.id, `로그인 중입니다.`);
            user = new User(id, nasHomepage, nasId, nasPassword, Mode.NONE);
            const isSuccess: boolean = await accessSequence(user, bot);
            console.log(isSuccess);
            if (isSuccess) {
                console.log('로그인 성공!');
                await bot.sendMessage(msg.chat.id, `로그인 성공!`);
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


