import puppeteer from 'puppeteer'

export const init = async () => {
    console.log(`🚧  초기 실행 진행 중...`)
    console.log(`🚧  헤드리스 크롬을 시작하고 있습니다..`)
    console.log(`🚧  중간에 언제든 Ctrl+C로 종료시킬 수 있습니다.\n`)

    try {
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/6.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
        ]

        const options = {
            args,
            headless: true,
            ignoreHTTPSErrors: true,
            userDataDir: './tmp',
        }

        let browser = await puppeteer.launch(options)
        console.log(`🚧  헤드리스 크롬이 시작되었습니다.`)
        
        return browser
    } catch (e) {
        console.log(`🚧  헤드리스 크롬 작동 중 오류가 발생하였습니다.`)
        console.log(e)
    }

    return undefined
}

// 페이지 이동
export const navigatePage = async (page: puppeteer.Page, targetUrl: string) => {
    try {
        await page.goto(targetUrl, {
            waitUntil: ['load', 'networkidle0'],
        })
        return true
    } catch (e) {
        console.log('페이지 접속 중 오류가 발생했습니다.')
        console.log('5초 뒤 해당 페이지 접속을 다시 시도합니다.')
        console.log(`문제가 된 페이지: ${targetUrl}\n`)
        await page.waitFor(5000)
        return false
    }
}

// 페이지 안전 이동
export const saftyGoto = async (page: puppeteer.Page, targetUrl: string) => {
    // 성공할때까지 계속 접속을 시도합니다.
    let isSuccess = false
    while (!isSuccess) isSuccess = await navigatePage(page, targetUrl)
}

export const delay = time => new Promise(res => setTimeout(res, time))
