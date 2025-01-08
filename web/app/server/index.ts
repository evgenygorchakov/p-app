import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server';
import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares

    app.use(viteDevMiddleware)
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }

    const pageContext = await renderPage(pageContextInit)
    if (pageContext.errorWhileRendering) {
      // Install error tracking here, see https://vike.dev/errors
    }

    const { httpResponse } = pageContext

    if (!httpResponse) {
      return next()
    } else {
      const { body, statusCode, earlyHints, headers } = httpResponse

      if (res.writeEarlyHints) {
        res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      }

      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/streaming
      res.send(body)
    }

    const port = process.env.PORT ?? 3000
    app.listen(port)
    console.log(`Server running at http://localhost:${port}`)
  })
}
