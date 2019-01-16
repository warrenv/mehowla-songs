import { describe } from 'riteway'
import sinon from 'sinon'
import middleware from './song'

describe('src/middlewares/song', async assert => {
  {
    const ctx = {
      url: '/',
    }
    const next = sinon.spy()

    await middleware(ctx, next)

    assert({
      given: 'a request url other than /songs/:id',
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
      get: () => {},
      url: '/songs/1',
      state: { songs: [] },
    }
    const next = sinon.spy()

    await middleware(ctx, next)

    assert({
      given: 'a request url of /song/:id',
      should: 'not call the next middleware',
      actual: next.calledOnce,
      expected: false,
    })
  }
})
