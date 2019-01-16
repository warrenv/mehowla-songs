import { describe } from 'riteway'
import fetch from 'node-fetch'

import app from '../../src/app'

const port = process.env.PORT || 8081
const host = process.env.HOST || 'localhost'

describe('tests/functional/retrieve_song', async assert => {
  const server = app().listen({ port, host }, () => { })

  const songsResponse = await fetch(`http://${host}:${port}/songs`)
  const songs = await songsResponse.json()
  const songResponse = await fetch(`http://${host}:${port}/song/${songs[0].id}`)

  assert({
    given: 'a request for a song by id',
    should: 'return success',
    actual: songResponse.status,
    expected: 200,
  })

  await server.close()
})
