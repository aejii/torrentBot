import { init, saftyGoto, delay } from './utils/puppeteer'
import { Browser } from 'puppeteer'

export const crawlingSequence = async () => {
    let browser = await init({ isHeadless: true })
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

export const accessSequence = async () => {
    let browser = await init({ isHeadless: false })
    if (browser) {
        console.log('Accessing...')
        await accessing(browser)
    } else {
        console.log('헤드리스 크롬을 켜는데 실패하였습니다.')
    }
}

export const accessing = async (browser: Browser) => {
    let page = await browser.newPage()

    console.log('NAS 사이트로 접속을 시도합니다.')

    // 원하는 페이지로 이동합니다.
    await saftyGoto(
        page,
        'http://saint2030.synology.me:5000/',
        'domcontentloaded'
    )
    console.log('NAS 사이트로 접속 되었습니다.')

    // 이미 로그인 된 경우는
    // 아이디 입력칸이 없어지는데,
    // 오류를 try ~ catch 함으로 인해 알아서 다음으로 넘어감
    try{
        // 3초간 혹시 모르니 대기합니다.
        await delay(3000)
        await page.type('#login_username', 'test', { delay: 200 })
        console.log('아이디 입력완료')
        
        await page.type('#login_passwd', 'qudwns12!@', { delay: 200 })
        console.log('비밀번호 입력완료')
    
        // 버튼 누르기 전 혹시 모르니 1초간 기다립니다.
        await delay(1000)
        console.log('로그인 시도 중..')
        await page.click('#login-btn')

        // 대략 4초간 기다립니다. (SPA라 페이지 이동 파악 불가)
        await delay(4000)
        console.log('로그인 완료')

    }catch(e){}

    //await page.click('.launch-icon')
    //console.log('파일 스테이션 버튼 클릭 완료')

    await page.click('[aria-label="메인 메뉴"]')
    console.log('메인 메뉴 버튼 클릭 완료')

    // 혹시 모르니 2초 대기
    await delay(2000)

    await page.click('[aria-label="Download Station"]')
    console.log('Download Station 버튼 클릭 완료')
}

// crawlingSequence()
accessSequence()
