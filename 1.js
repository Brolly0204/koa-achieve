const Koa = require('koa')
const Emitter = require('events')
const app = new Koa()


app.use(async (ctx, next) => {
  ctx.body = 'Hi Brolly!'
})

app.listen(2233)

console.log(app.middleware) 
