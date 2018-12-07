import express from 'express'
const router = express.Router()
import path from 'path'

/* GET users listing. */
router.get('/public/payment/example', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, './../public', 'index.html'))
})

module.exports = router
