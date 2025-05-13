import type { Page } from 'puppeteer-core'
import { scriptPath } from 'src/pagedjs'
import { getBrowser } from './puppeteerSingleton'

declare global {
  interface Window {
    PagedConfig: {
      auto: boolean
    }
  }
}
/**
 * Paged.jsでページ分割済みの状態までPuppeteerで待つ共通関数
 */
export async function pagedjsRenderPage(
  html: string,
  pagedJsPath: string,
  options: { preview?: boolean }
): Promise<Page> {
  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    window.PagedConfig = window.PagedConfig || {}
    window.PagedConfig.auto = false
  })
  await page.addScriptTag({ path: pagedJsPath })

  // フォント指定
  await page.addStyleTag({
    content: `
    body {
      font-family: 'Noto Sans JP', sans-serif;
    }
    `,
  })
  // ページ設定
  await page.addStyleTag({
    content: `
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
      @bottom-center {
        content: counter(page) " / " counter(pages);
      }
    }

    table {
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    .pagedjs_page {
      border: ${options.preview ? 'thin solid #ddd' : 'none'};
      margin: ${options.preview ? '10px' : '0px'};
    }`,
  })
  return page
}

/**
 * PuppeteerでPaged.jsを組み込み、ページ分割済みのHTMLを返す
 * @param html 任意のHTML文字列
 * @param options pagedJsPath: Paged.jsのパス
 * @returns Paged.js組み込み・ページ分割済みHTML
 */
export async function htmlToPreviewHtml(
  html: string,
  options?: { pagedJsPath?: string }
): Promise<string> {
  const pagedJsPath = options?.pagedJsPath || scriptPath
  const page = await pagedjsRenderPage(html, pagedJsPath, { preview: true })
  const resultHtml = await page.content()
  await page.close()
  return resultHtml
}
