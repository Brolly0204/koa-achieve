const http = require('http')
const Emitter = require('events')
const context = require('./context')

class Loa extends Emitter {
  constructor() {
    super()
    this.context = Object.create(context);
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
  callback() {
    const fn = this.compose(this.middleware)
    return (req, res) => {
        const ctx = this.createContext(req, res)
       return this.handlerRequest(ctx, fn)
    }
  }

  handlerRequest(ctx, fn) {
    return fn(ctx).then(() => this.respond(ctx))
  }

  compose(middleware) {
    return (context, next) => {
       let index = -1
       return dispatch(0)
       function dispatch(i) {
         let fn = middleware[i]
         if (i === middleware.length) fn = next
         if (!fn) return Promise.resolve()
         return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
       }
    }
  }

  createContext(req, res) {
    const context = Object.create(this.context)
    context.app = this;
    context.request = context.req = req;
    context.response = context.res = res;
    context.originalUrl = req.url;
    context.state = {};
    return context
  }

  respond (ctx) {
    const {res, body} = ctx
    if (body) {
      return res.end(String(ctx.body))
    }
      return res.end()
  }
}

const loa = new Loa()

loa.use(async (ctx, next) => {
  const aa = await next()
  ctx.body = 'Hello ' + aa
  // ctx.res.end('hello ' + aa)
})
loa.use(async ({req, res}, next) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Borlly! ${Date.now()}`)
    }, 1000)
  })
})

loa.listen(8000)