// See https://www.codeproject.com/Articles/813480/HTTP-Partial-Content-In-Node-js

import * as fs from 'fs'

const songPath = new RegExp('^/songs/[0-9]+$')
const idFrom = url => url.split('/').pop()

const readRangeHeader = (range, totalLength) => {
  /*
   * Example of the method 'split' with regular expression.
   *
   * Input: bytes=100-200
   * Output: [null, 100, 200, null]
   *
   * Input: bytes=-200
   * Output: [null, null, 200, null]
   */

  if (range === null || range.length === 0) { return null }

  var array = range.split(/bytes=([0-9]*)-([0-9]*)/)
  var start = parseInt(array[1])
  var end = parseInt(array[2])
  var result = {
    Start: isNaN(start) ? 0 : start,
    End: isNaN(end) ? (totalLength - 1) : end,
  }

  if (!isNaN(start) && isNaN(end)) {
    result.Start = start
    result.End = totalLength - 1
  }

  if (isNaN(start) && !isNaN(end)) {
    result.Start = totalLength - end
    result.End = totalLength - 1
  }

  return result
}

const filenameFromId = songs => id => songs
  .filter(song => song.id === id)
  .map(({ filename }) => `./data/${filename}`)[0]

const songData = (rangeHeader, filename) => {
  const stat = fs.statSync(filename)
  const rangeRequest = readRangeHeader(rangeHeader, stat.size)

  // If 'Range' header exists, we will parse it with Regular Expression.
  if (rangeRequest === null) {
    return {
      headers: [
        ['Content-Type', 'audio/mpeg'],
        ['Content-Length', stat.size],
        ['Accept-Ranges', 'bytes'],
      ],

      //  If not, will return file directly.
      response: 200,
      stream: fs.createReadStream(filename),
    }
  }

  const start = rangeRequest.Start
  const end = rangeRequest.End

  // If the range can't be fulfilled.
  if (start >= stat.size || end >= stat.size) {
    return {
      headers: [
        // Indicate the acceptable range.
        ['Content-Range', 'bytes */' + stat.size],
      ],

      // Return the 416 'Requested Range Not Satisfiable'.
      response: 416,
      stream: null,
    }
  }

  return {
    headers: [
      ['Content-Type', 'audio/mpeg'],
      ['Content-Range', 'bytes ' + start + '-' + end + '/' + stat.size],
      ['Content-Length', start === end ? 0 : (end - start + 1)],
      ['Accept-Ranges', 'bytes'],
      ['Cache-Control', 'no-cache'],
    ],
    status: 206,
    stream: fs.createReadStream(filename),
  }
}

const getSongStream = (songs, rangeHeader, url) => {
  const filename = filenameFromId(songs)(idFrom(url))
  return fs.existsSync(filename) ? songData(rangeHeader, filename) : {}
}

export default async (ctx, next) => {
  if (ctx.url.match(songPath)) {
    const { headers, status, stream } = getSongStream(ctx.state.songs, ctx.get('range'), ctx.url)

    if (stream) {
      headers.forEach(([ name, val ]) => ctx.set(name, val))
      ctx.status = status
      ctx.body = await stream
    } else {
      ctx.status = status || 404
    }
  } else {
    await next()
  }
}
