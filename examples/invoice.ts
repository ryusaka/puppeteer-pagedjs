import * as fs from 'node:fs/promises'
import { htmlToPdf } from '../src/htmlToPdf'

async function main() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>請求書サンプル</title>
        <style>
          body { font-family: 'Yu Gothic', 'Meiryo', sans-serif; margin: 40px; }
          h1 { color: #007acc; font-size: 2em; margin-bottom: 0.2em; }
          .date { text-align: right; margin-bottom: 2em; color: #555; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 2em; }
          th, td { border: 1px solid #aaa; padding: 8px 12px; text-align: left; }
          th { background: #f0f6fa; }
          tfoot td { font-weight: bold; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>請求書</h1>
        <div class="date">発行日: 2024-06-01</div>
        <table>
          <thead>
            <tr>
              <th>品目</th>
              <th>数量</th>
              <th>単価</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Webサイト制作</td>
              <td>1</td>
              <td>¥300,000</td>
              <td>¥300,000</td>
            </tr>
            <tr>
              <td>保守サポート（月額）</td>
              <td>3</td>
              <td>¥20,000</td>
              <td>¥60,000</td>
            </tr>
            <tr>
              <td>ドメイン・SSL費用</td>
              <td>1</td>
              <td>¥10,000</td>
              <td>¥10,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">合計</td>
              <td>¥370,000</td>
            </tr>
          </tfoot>
        </table>
        <p>上記の通りご請求申し上げます。</p>
      </body>
    </html>
  `

  const pdf = await htmlToPdf(html, {
    pdf: { format: 'A4' },
  })

  await fs.writeFile('./dist/invoice.pdf', pdf)
  console.log('invoice.pdf を出力しました')
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
