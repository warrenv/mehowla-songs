import { describe } from 'riteway'
import sinon from 'sinon'

import middleware from './songlist'
import songs from '../../data/songs.json'

describe('src/middlewares/songlist', async assert => {
  const ctx = { state: {} }
  const nextSpy = sinon.spy()

  middleware(ctx, nextSpy)

  assert({
    given: 'a call to the middleware',
    should: 'add the songs to the context state',
    actual: ctx.state.songs,
    expected: songs,
  })

  assert({
    given: 'a call to the middleware',
    should: 'call the next middleware',
    actual: nextSpy.calledOnce,
    expected: true,
  })
})
