import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { type PageContext } from 'vike/types'
import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

export async function onRenderHtml(pageContext: PageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInject`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>p-app</title>
    </head>
    <body>
      <div id="app">${dangerouslySkipEscape(appHtml)}</div>
    </body>
  </html>
  `
}
