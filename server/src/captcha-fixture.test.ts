import type { FastifyInstance, InjectOptions } from 'fastify'
import { solveChallenge } from 'altcha-lib'
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'

let challengeClient = 0
export async function proof(app: FastifyInstance) {
  // A separate synthetic client keeps challenge requests out of signup-rate assertions.
  const challenge = (await app.inject({ url: '/api/captcha/challenge', remoteAddress: `192.0.2.${++challengeClient % 250 + 1}` })).json()
  const solution = await solveChallenge({ challenge, deriveKey })
  return Buffer.from(JSON.stringify({ challenge, solution })).toString('base64')
}

export async function inject(app: FastifyInstance, options: InjectOptions) {
  if (options.method === 'POST' && options.url === '/api/waitlist' && options.payload && typeof options.payload === 'object') {
    options = { ...options, payload: { ...options.payload, altcha: await proof(app) } }
  }
  return app.inject(options)
}
