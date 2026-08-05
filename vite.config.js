import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import otpHandler from './netlify/functions/msg91-otp.mjs'

function otpDevMiddleware() {
  return {
    name: 'ruchi-otp-dev-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/otp', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request('http://localhost/api/otp', {
            method: 'POST',
            headers: { 'content-type': req.headers['content-type'] || 'application/json' },
            body: Buffer.concat(chunks),
          })
          const response = await otpHandler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (error) {
          server.config.logger.error('OTP dev endpoint failed: ' + (error?.stack || error))
          res.statusCode = 502
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'The OTP service is temporarily unavailable. Please try again.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), otpDevMiddleware()],
  build: {
    outDir: 'dist',
  },
})