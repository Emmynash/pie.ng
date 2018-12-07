import { concat } from '../utils/_'
import configBase from './config.base'

const clientConfig = concat(configBase, {
  client: true
})

export default clientConfig