import app from '../../server/index.js'

export const onRequest = (context) => {
  return app.fetch(context.request, context.env, context)
}
