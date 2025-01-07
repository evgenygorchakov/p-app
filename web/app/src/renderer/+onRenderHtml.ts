import { escapeInject } from 'vike/server'

export async function onRenderHtml() {
  return escapeInject`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>p-app</title>
    </head>
    <body>
      <div id="app"></div>
    </body>
  </html>
  `
}
