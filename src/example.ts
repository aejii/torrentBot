import { init, saftyGoto } from './utils/puppeteer'
import { Browser } from 'puppeteer'

export const exampleSequence = async () => {
    let browser = await init()
    if(browser){
        console.log('Crawling...')
        await crawling(browser)
    }else{
        console.log('헤드리스 크롬을 켜는데 실패하였습니다.')
    }
}

export const crawling = async (browser: Browser) => {
    let page = await browser.newPage()

    console.log('토렌트 사이트로 접속을 시도합니다.')

    // 원하는 페이지로 이동합니다.
    await saftyGoto(page, 'https://torrentwal2.com/')
    console.log('토렌트 사이트로 접속 되었습니다.')

    let bodyInnerHTML = await page.evaluate(()=>{

        // body 전체를 그냥 긁어옵니다.
        return document.body.innerHTML
    })

    console.log('bodyInnerHTML 길이:', bodyInnerHTML.length)
    console.log(bodyInnerHTML)
}

exampleSequence()