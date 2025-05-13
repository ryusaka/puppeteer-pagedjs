import chromium from '@sparticuz/chromium'
import puppeteer, { type Browser } from 'puppeteer-core'

let browserSingleton: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  const shouldUseCore = process.env.NODE_ENV === 'production'
  if (!browserSingleton) {
    browserSingleton = await puppeteer.launch(
      shouldUseCore
        ? {
            headless: true,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            args: chromium.args,
          }
        : {
            headless: true,
            defaultViewport: chromium.defaultViewport,
            args: chromium.args,
            executablePath: await import('puppeteer').then(m =>
              m.executablePath()
            ),
          }
    )
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
