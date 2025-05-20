import chromium from '@sparticuz/chromium'
import puppeteer, { type Browser } from 'puppeteer-core'

let browserSingleton: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  if (!browserSingleton) {
    const isLocal = !process.env.NODE_ENV
    const headlessType = process.env.IS_LOCAL ? false : 'shell'
    const viewport = {
      deviceScaleFactor: 1,
      hasTouch: false,
      height: 1080,
      isLandscape: true,
      isMobile: false,
      width: 1920,
    }
    browserSingleton = await puppeteer.launch({
      headless: true,
      args: isLocal
        ? puppeteer.defaultArgs()
        : puppeteer.defaultArgs({
            args: chromium.args,
            headless: headlessType,
          }),
      executablePath: isLocal
        ? await import('puppeteer').then(m => m.executablePath())
        : await chromium.executablePath(),
      defaultViewport: viewport,
    })
    // プロセス終了時にクリーンアップ
    const cleanup = async () => {
      if (browserSingleton) {
        await browserSingleton.close()
        browserSingleton = null
      }
    }
    process.once('exit', cleanup)
    process.once('SIGINT', cleanup)
    process.once('SIGTERM', cleanup)
  }
  return browserSingleton
}
