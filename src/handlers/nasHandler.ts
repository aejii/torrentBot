import { Browser } from "puppeteer";
import {delay, getBrowser, init, navigatePage, saftyGoto} from "../utils/puppeteer";
import {User} from "../domain/user";
import TelegramBot from 'node-telegram-bot-api'
import {Mode} from "../domain/mode";

let page;

export const accessSequence = async (user: User, bot: TelegramBot): Promise<boolean> => {
    let browser = await getBrowser();
    if (browser) {
        console.log('Accessing...')
        return await accessing(browser, user, bot)
    } else {
        console.log('헤드리스 크롬을 켜는데 실패하였습니다.')
        return false;
    }
}

export const accessing = async (browser: Browser, user: User, bot: TelegramBot): Promise<boolean> => {
    if (!page) {
        page = await browser.newPage()
    }

    console.log('NAS 사이트로 접속을 시도합니다.')
    await bot.sendMessage(user.id, `NAS 사이트로 접속을 시도합니다.`);

    // 원하는 페이지로 이동합니다.
    const pageSuccess = await navigatePage(
        page,
        user.nasHomepage,
        'domcontentloaded'
    )

    if (!pageSuccess) {
        await bot.sendMessage(user.id, `주소, 아이디, 비번을 다시 입력해주세요.`);
        user.mode = Mode.LOGIN;
        return false;
    }

    console.log('NAS 사이트로 접속 되었습니다.')
    await bot.sendMessage(user.id, `NAS 사이트로 접속 되었습니다.`);

    // 이미 로그인 된 경우는
    // 아이디 입력칸이 없어지는데,
    // 오류를 try ~ catch 함으로 인해 알아서 다음으로 넘어감
    try{

        // 3초간 혹시 모르니 대기합니다.
        await delay(3000)
        await page.type('#login_username', user.nasId, { delay: 200 })
        console.log('아이디 입력완료')
        await bot.sendMessage(user.id, `아이디 입력완료`);

        await page.type('#login_passwd', user.nasPassword, { delay: 200 })
        console.log('비밀번호 입력완료')
        await bot.sendMessage(user.id, `비밀번호 입력완료`);

        // 버튼 누르기 전 혹시 모르니 1초간 기다립니다.
        await delay(1000)
        console.log('로그인 시도 중..')
        await bot.sendMessage(user.id, `로그인 시도 중..`);
        await page.click('#login-btn')

        // 대략 4초간 기다립니다. (SPA라 페이지 이동 파악 불가)
        await delay(4000)

        let passwordCheck = await page.evaluate(() => {
            // 아래 코드 같은거로 원하는 정보만 쏙 빼올 수 있습니다.
            // document.querySelector('원하는 HTML 셀렉터')
            // body 전체를 그냥 긁어옵니다.
            return document.querySelector('#login_username')
        })

        if (passwordCheck) {
            await bot.sendMessage(user.id, `비밀번호가 틀렸습니다. 다시 입력해주세요.`);
            return false;
        }

        console.log('완료')
        // await bot.sendMessage(user.id, `로그인 완료`);

        return true;

    }catch(e){
        await bot.sendMessage(user.id, `이미 로그인 되어 있습니다.`);
        return false
    }

    //await page.click('.launch-icon')
    //console.log('파일 스테이션 버튼 클릭 완료')

    // await page.click('[aria-label="메인 메뉴"]')
    // console.log('메인 메뉴 버튼 클릭 완료')
    //
    // // 혹시 모르니 2초 대기
    // await delay(2000)
    //
    // await page.click('[aria-label="Download Station"]')
    // console.log('Download Station 버튼 클릭 완료')
}


