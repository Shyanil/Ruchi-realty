import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import otpHandler from './netlify/functions/msg91-otp.mjs'
import blogCommentsHandler from './netlify/functions/blog-comments.mjs'

function netlifyFunctionDevMiddleware() {
  return {
    name: 'ruchi-netlify-function-dev-endpoints',
    configureServer(server) {
      const handle = (path, handler) => server.middlewares.use(path, async (req, res) => {
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request(`http://localhost${path}`, {
            method: req.method,
            headers: {
              'content-type': req.headers['content-type'] || 'application/json',
              'x-forwarded-for': req.socket.remoteAddress || '',
            },
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          })
          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (error) {
          server.config.logger.error(`${path} dev endpoint failed: ` + (error?.stack || error))
          res.statusCode = 502
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'The local API endpoint is temporarily unavailable.' }))
        }
      })

      handle('/api/otp', otpHandler)
      handle('/api/blog-comments', blogCommentsHandler)
    },
  }
}

export default defineConfig({
  plugins: [react(), netlifyFunctionDevMiddleware()],
  build: {
    outDir: 'dist',
  },
})
