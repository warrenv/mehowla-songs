import app from './src/app'

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

app(process.env).listen({ port, host }, () => {
  console.log(`app is listening on ${host}:${port}`)
})
