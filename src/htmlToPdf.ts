import type { PDFOptions } from 'puppeteer'
import { pagedjsRenderPage } from './htmlToPreviewHtml'
import { scriptPath } from './pagedjs'
export interface HtmlToPdfOptions {
  pagedJsPath?: string
  pdf?: PDFOptions // PuppeteerのPDFオプション
}

/**
 * 任意のHTMLをPaged.jsでページ分割しPDF（Uint8Array）に変換
 */
export async function htmlToPdf(
  html: string,
  options?: HtmlToPdfOptions
): Promise<Uint8Array> {
  const pagedJsPath = options?.pagedJsPath || scriptPath
  const page = await pagedjsRenderPage(html, pagedJsPath, { preview: false })
  const settings: PDFOptions = {
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    ...options?.pdf,
    format: options?.pdf?.format ?? 'A4',
  }
  const pdfUint8Array = await page.pdf(settings)
  await page.close()
  return pdfUint8Array
}
