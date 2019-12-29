import {getBrowser, init, saftyGoto} from "../utils/puppeteer";
import {Browser} from "puppeteer";

export const crawlingSequence = async () => {
    let browser = await getBrowser();
    if (browser) {
        console.log('Crawling...')
        await crawling(browser)
    } else {
        console.log('헤드리스 크롬을 켜는데 실패하였습니다.')
    }
}

export const crawling = async (browser: Browser) => {
    let page = await browser.newPage()

    console.log('토렌트 사이트로 접속을 시도합니다.')

    // 원하는 페이지로 이동합니다.
    await saftyGoto(page, 'https://torrentwal2.com/')
    console.log('토렌트 사이트로 접속 되었습니다.')

    let bodyInnerHTML = await page.evaluate(() => {
        // 아래 코드 같은거로 원하는 정보만 쏙 빼올 수 있습니다.
        // document.querySelector('원하는 HTML 셀렉터')

        // body 전체를 그냥 긁어옵니다.
        return document.body.innerHTML
    })

    console.log('bodyInnerHTML 길이:', bodyInnerHTML.length)
}
