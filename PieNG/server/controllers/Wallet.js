import express from 'express'
import unirest from 'unirest'
import config from '../config/config.server'
import models from '../models'
import helpers from '../helpers/generic'
const router = express.Router()

router.get('/api/v1/wallet/funding', function(req, res, next) {
    let { walletId, trxref } = req.body
    if (!walletId || !trxref) {
        return res.status(400).json({
            message: 'Invalid request'
        })
    }
    models.wallet.findById(walletId).then(wallet => {
        if (helpers.isEmpty(wallet)) {
            const payload = {
                'SECKEY': '',
                'flw_ref': ''
            }
        }
    })
})

module.exports = router
