import Koa from 'koa'
import { song, songlist, songs } from './middlewares'

export default (localConfig = {}) => {
  const app = new Koa()

  app.use(songlist)
  app.use(songs)
  app.use(song)

  return app
}
