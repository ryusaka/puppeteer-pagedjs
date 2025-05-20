import * as fs from 'node:fs/promises'
import { htmlToPdf } from '../src/htmlToPdf'
import { htmlToPreviewHtml } from '../src/htmlToPreviewHtml'

async function main() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>請求書サンプル</title>
        <style>
          h1 { color: #007acc; font-size: 2em; margin-bottom: 0.2em; }
          .date { text-align: right; margin-bottom: 2em; color: #555; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 2em; }
          th, td { border: 1px solid #aaa; padding: 8px 12px; text-align: left; }
          th { background: #f0f6fa; }
          tfoot td { font-weight: bold; background: #f9f9f9; }
          .english-words { font-family: Arial; }
        </style>
      </head>
      <body>
        <div>Hello World with Noto Sans JP</div>
        <h1>請求書</h1>
        <div class="date">発行日: 2024-06-01</div>
        <div class="english-words">English words</div>
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
            <tr>
              <td>追加作業A</td>
              <td>2</td>
              <td>¥15,000</td>
              <td>¥30,000</td>
            </tr>
            <tr>
              <td>追加作業B</td>
              <td>5</td>
              <td>¥8,000</td>
              <td>¥40,000</td>
            </tr>
            <tr>
              <td>追加作業C</td>
              <td>3</td>
              <td>¥12,000</td>
              <td>¥36,000</td>
            </tr>
            <tr>
              <td>追加作業D</td>
              <td>4</td>
              <td>¥9,000</td>
              <td>¥36,000</td>
            </tr>
            <tr>
              <td>追加作業E</td>
              <td>6</td>
              <td>¥7,000</td>
              <td>¥42,000</td>
            </tr>
            <tr>
              <td>追加作業F</td>
              <td>2</td>
              <td>¥18,000</td>
              <td>¥36,000</td>
            </tr>
            <tr>
              <td>追加作業G</td>
              <td>7</td>
              <td>¥5,000</td>
              <td>¥35,000</td>
            </tr>
            <tr>
              <td>追加作業H</td>
              <td>8</td>
              <td>¥4,000</td>
              <td>¥32,000</td>
            </tr>
            <tr>
              <td>追加作業I</td>
              <td>10</td>
              <td>¥3,000</td>
              <td>¥30,000</td>
            </tr>
            <tr>
              <td>追加作業J</td>
              <td>12</td>
              <td>¥2,500</td>
              <td>¥30,000</td>
            </tr>
            <tr>
              <td>追加作業K</td>
              <td>4</td>
              <td>¥11,000</td>
              <td>¥44,000</td>
            </tr>
            <tr>
              <td>追加作業L</td>
              <td>9</td>
              <td>¥6,000</td>
              <td>¥54,000</td>
            </tr>
            <tr>
              <td>追加作業M</td>
              <td>3</td>
              <td>¥13,000</td>
              <td>¥39,000</td>
            </tr>
            <tr>
              <td>追加作業N</td>
              <td>7</td>
              <td>¥8,500</td>
              <td>¥59,500</td>
            </tr>
            <tr>
              <td>追加作業O</td>
              <td>5</td>
              <td>¥10,000</td>
              <td>¥50,000</td>
            </tr>
            <tr>
              <td>追加作業P</td>
              <td>6</td>
              <td>¥7,500</td>
              <td>¥45,000</td>
            </tr>
            <tr>
              <td>追加作業Q</td>
              <td>8</td>
              <td>¥5,500</td>
              <td>¥44,000</td>
            </tr>
            <tr>
              <td>追加作業R</td>
              <td>2</td>
              <td>¥16,000</td>
              <td>¥32,000</td>
            </tr>
            <tr>
              <td>追加作業S</td>
              <td>10</td>
              <td>¥4,500</td>
              <td>¥45,000</td>
            </tr>
            <tr>
              <td>追加作業T</td>
              <td>11</td>
              <td>¥3,800</td>
              <td>¥41,800</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">合計</td>
              <td>¥1,171,300</td>
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
  const previewHtml = await htmlToPreviewHtml(html)

  await fs.writeFile('./dist/invoice.pdf', pdf)
  await fs.writeFile('./dist/invoice.html', previewHtml)
  console.log('invoice.pdf を出力しました')
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
