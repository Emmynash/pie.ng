import serverConfig from './config/config.server'
if(serverConfig.env === 'development' && (!serverConfig.db.urlLive && !serverConfig.env.apiUrl && !serverConfig.env.appUrl)){
  console.log('Please `cp .env.example .env` first')
  console.log('exiting..')
  console.log(serverConfig)
  process.exit()
}
import path from 'path'
import express from 'express'
import models  from './models'
import debug from 'debug'
import controllers from './controllers'
import logger from 'morgan'
import bodyParser from 'body-parser'
import wpMiddleware from './middlewares/webpack'
import populateUser from './middlewares/populateUser'
import favicon from 'serve-favicon'
import exphbs from 'express-handlebars'
import * as helpers from './helpers/hbsHelpers.js'

const dbg = debug('pie:server')
const app = express()

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//static & views
let layoutDir = []
let partialsDir = []
if(serverConfig.env === 'development') {
  app.use('/static', express.static(path.join(__dirname, '../public')))
  layoutDir.push(path.join(__dirname, '../views', 'layouts'))
  partialsDir.push(path.join(__dirname, '../views', 'partials'))
}else{
  app.use('/static', express.static(path.join(__dirname, '../../public')))
  layoutDir.push(path.join(__dirname, '../../views', 'layouts'))
  partialsDir.push(path.join(__dirname, '../../views', 'partials'))
}
// Use Handlebars as my main render engine
app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main',
        layoutDir,
        partialsDir,
        helpers,
    })
)

if(serverConfig.env === 'development') {
  app.set('views', path.join(__dirname, '../views'))
}else{
  app.set('views', path.join(__dirname, '../../views'))
}
app.set('view engine', 'handlebars')
// enable aggressive view caching for production
app.enable('view cache')

app.all((req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*') // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key')
  res.header('Access-Control-Max-Age', 20)
  if (req.method === 'OPTIONS') {
    res.header('Content-Type', 'application/json')
    return res.status(200).end()
  } else {
    next()
  }
})

// Load webpack if in dev mode
if(serverConfig.env === 'development') {
  const webpack = require('webpack')
	const webpackConfig = require(path.join(serverConfig.root, 'webpack.config.dev'))
	const compiler = webpack(webpackConfig)
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}))
	app.use(require('webpack-hot-middleware')(compiler))
	app.use(express.static(path.resolve(__dirname, '../client')))
	app.use(express.static(path.resolve(__dirname, '../.template')))
} else if(serverConfig.env === 'production') {
	app.use(express.static(path.resolve(__dirname, '../client')))
}

app.use('*', populateUser)
app.use(controllers)

app.get('*', wpMiddleware)


/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + serverConfig.port
    : 'Port ' + serverConfig.port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  var addr = app.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  dbg('Listening on ' + bind)
}


// models.sequelize.sync({
//   logging: serverConfig.env !== 'production' ? console.log : false
// }).then(() => {
  app.listen(serverConfig.port)
  app.on('error', onError)
  app.on('listening', onListening)
// })

console.log('server environment', serverConfig.env)