import { describe } from 'riteway'
import sinon from 'sinon'
import middleware from './songs'

describe('src/middlewares/songs', async assert => {
  {
    const ctx = { request: { url: '/' }, state: {} }
    const next = sinon.spy()

    await middleware(ctx, next)

    assert({
      given: 'a request url other than /songs',
      should: 'call the next middleware',
      actual: next.calledOnce,
      expected: true,
    })
  }

  {
    const ctx = {
      response: {
        set: () => {},
      },
      request: { url: '/songs' },
      state: {},
    }
    const next = sinon.spy()

    await middleware(ctx, next)

    assert({
      given: 'a request url of /songs',
      should: 'not call the next middleware',
      actual: next.calledOnce,
      expected: false,
    })
  }
})
