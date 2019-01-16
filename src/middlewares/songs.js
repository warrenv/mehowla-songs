const coerce = songs => songs.map(({ id, title, artist }) => ({ id, title, artist }))

export default async (ctx, next) => {
  if (ctx.request.url === '/songs') {
    ctx.body = coerce(ctx.state.songs)
  } else {
    await next()
  }
}
