import songs from '../../data/songs.json'

export default async (ctx, next) => {
  ctx.state = { ...ctx.state, songs }
  await next()
}
