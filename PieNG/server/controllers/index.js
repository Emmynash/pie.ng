const fs = require('fs')
const path = require('path')
const router = require('express').Router()
const _ = require('lodash')
const basename  = path.basename(module.filename)

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    let route = require(path.join(__dirname, file))
    if(!_.isEmpty(route)) router.use(route)
  })

module.exports = router
