import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { htmlToPdf } from './htmlToPdf'
import { htmlToPreviewHtml } from './htmlToPreviewHtml'
import { getBrowser } from './puppeteerSingleton'

const app = new Hono()

app.get('/health', c => {
  return c.json({ status: 'ok' })
})

const schema = z.object({
  html: z.string(),
})

app.post('/', zValidator('json', schema), async c => {
  const html = c.req.valid('json').html
  try {
    const pdf = await htmlToPdf(html, { pdf: { format: 'A4' } })
    c.header('Content-Type', 'application/pdf')
    return c.body(pdf)
  } catch (e) {
    console.error(e)
    return c.text('PDF生成中にエラーが発生しました', 500)
  }
})

app.post('/preview', zValidator('json', schema), async c => {
  const html = c.req.valid('json').html
  const previewHtml = await htmlToPreviewHtml(html)
  c.header('Content-Type', 'text/html')
  return c.body(previewHtml)
})

// コールドスタートで初回レンダリング時に遅くなるので、サーバー起動時にブラウザを起動しておく
getBrowser()

const server = serve(app)

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close(err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
