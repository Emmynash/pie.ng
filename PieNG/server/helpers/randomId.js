import uniqueKey from 'unique-key'

export default randomId => (len = 16, prefix = '') => uniqueKey(len,prefix)