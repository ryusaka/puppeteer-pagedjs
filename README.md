# puppeteer-pagedjs

任意のHTMLをPaged.js + PuppeteerでPDF変換・プレビューHTML生成するTypeScriptパッケージ

## セットアップ

```sh
pnpm install
```

## 依存パッケージ
- puppeteer
- typescript
- @types/node
- Paged.js（public/paged.polyfill.jsに配置）

## 提供API

### htmlToPdf
- 任意のHTML文字列をPDF（Buffer）に変換

### htmlToPreviewHtml
- 任意のHTML文字列にPaged.jsを自動組み込みし、プレビュー用HTMLを返す

## ディレクトリ構成

```
/src
  index.ts
  htmlToPdf.ts
  htmlToPreviewHtml.ts
/public
  paged.polyfill.js
```

---

## 使い方（予定）

```ts
import { htmlToPdf, htmlToPreviewHtml } from 'puppeteer-pagedjs';

const previewHtml = htmlToPreviewHtml('<html>...</html>');
const pdfBuffer = await htmlToPdf('<html>...</html>');
```
