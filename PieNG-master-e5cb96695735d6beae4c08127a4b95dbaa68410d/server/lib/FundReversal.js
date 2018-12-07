const models = require('../models')
const config = require('../config/config.server')
const _ = require('lodash')
const uniqueKey = require('unique-key')
const helpers = require('../helpers/generic')
const { INVALID_REQUEST, SERVER_ERROR, NOT_AUTHORIZED, PREFIXES } = require('../config/constants')

module.exports = (transactions, amount, narration = null) => {
    //amount assumed to be in kobo

}